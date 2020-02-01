import React, { useState } from "react"
import {
  Button,
  Card,
  makeStyles,
  CardContent,
  Typography,
} from "@material-ui/core"
import MicComponent from "./MicComponent"
import Axios from "axios"
import LiveTable from "./LiveTable"

const useStyles = makeStyles((theme) => ({
  cardStyle: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
  },
  title: {
    fontSize: 14,
  },
}))

const removeDuplicates = (array) => {
  array.splice(0, array.length, ...new Set(array))
}

function AttendanceComponent(props) {
  const { background, secondary } = props.palette
  const classes = useStyles()

  const [record, setRecord] = useState(false)
  const [recording, setRecording] = useState(false)
  const [said, setSaid] = useState("")
  const [recorderStartedAt, setRecorderStartedAt] = useState(Date.now())
  const [attendanceData, setAttendanceData] = useState({
    present: [],
    absent: [],
  })
  const [prevContext, setPrevContext] = useState(0)

  const toggleRecord = () => {
    setRecording(!recording)
    localStorage.removeItem("prevBlob")
    if (record) {
      stopRecording()
    } else {
      startRecording()
      setRecorderStartedAt(Date.now())
    }
  }

  const startRecording = () => {
    setRecord(true)
  }

  const stopRecording = () => {
    setRecord(false)
  }

  const onTimeClick = () => {
    if (record && Date.now() - recorderStartedAt >= 5000) {
      onFiveSeconds()
    }
  }

  const onFiveSeconds = () => {
    stopRecording()
    setRecorderStartedAt(Date.now())
    startRecording()
  }

  const onStop = (aud) => {
    const lstPrevBlob = localStorage.getItem("prevBlob")
    let prevBlob
    if (lstPrevBlob) {
      const byteCharacters = atob(lstPrevBlob.substring(22))
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      prevBlob = new Blob([byteArray], { type: "audio/wav" })
    } else {
      prevBlob = null
    }

    let formData = new FormData()

    if (prevBlob) {
      formData.append(
        "prevAudio",
        new File(
          [prevBlob],
          `audioPrev-${Math.random()
            .toString(36)
            .substring(2)}.wav`,
          { type: "audio/wav" },
        ),
      )
    }

    formData.append(
      "currAudio",
      new File(
        [aud.blob],
        `audioCurr-${Math.random()
          .toString(36)
          .substring(2)}.wav`,
        { type: "audio/wav" },
      ),
    )

    formData.append("key", "amakekeudaina")
    formData.append("end", "100")
    console.log("prevContext -> ", prevContext)
    formData.append("prevContext", prevContext)

    Axios.post(
      "https://smart-attendance-qkfjvcvewq-de.a.run.app/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    )
      .then((dat) => {
        console.log(dat.data, dat.status)

        if (dat.status !== 201) {
          setSaid("👂 ~Gibberish~")
          return
        }

        setSaid(dat.data["raw"])
        setPrevContext(dat.data["message"]["prevContext"])

        let ps = [...dat.data["message"]["present"], ...attendanceData.present]
        let abs = [...dat.data["message"]["absent"], ...attendanceData.absent]

        ps = ps.filter((val) => typeof val === "number")
        abs = abs.filter((val) => typeof val === "number")

        removeDuplicates(ps)
        removeDuplicates(abs)

        let newAttendanceData = {
          present: ps,
          absent: abs,
        }

        console.log(newAttendanceData)

        setAttendanceData(newAttendanceData)
      })
      .catch((err) => console.log(err))

    let fr = new FileReader()
    fr.onload = (e) => {
      localStorage.setItem("prevBlob", e.target.result)
    }
    fr.readAsDataURL(aud.blob)
  }

  return (
    <>
      <MicComponent
        record={record}
        bgCol={background.default}
        stCol={secondary.light}
        onStop={onStop}
        onClick={onTimeClick}
      />
      <Button
        size="medium"
        variant="contained"
        onClick={toggleRecord}
        color={recording ? "primary" : "secondary"}
      >
        {recording ? "Recording" : "Record"}
      </Button>
      <LiveTable attendanceData={attendanceData} />
      {said !== "" && (
        <Card className={classes.cardStyle} variant="outlined">
          <CardContent>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              I have heard
            </Typography>
            <Typography variant="h5" component="h2">
              {said}
            </Typography>
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default AttendanceComponent
