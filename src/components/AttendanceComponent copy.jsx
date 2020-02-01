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

function AttendanceComponent(props) {
  const { background, secondary } = props.palette
  const classes = useStyles()

  const [recording, setRecording] = useState(false)
  const [record, setRecord] = useState(false)
  const [said, setSaid] = useState("")
  const [recorderStartedAt, setRecorderStartedAt] = useState(Date.now())
  const [lastBlob, setLastBlob] = useState(null)
  const [attendanceData, setAttendanceData] = useState(null)
  const [keeey, setKeeey] = useState(1)

  const recordButtonClick = () => {
    toggleRecord()
    setTimeout(setLastBlob, 0, null)
  }

  const toggleRecord = () => {
    setRecording(!recording)
    if (record) {
      stopRecording()
    } else {
      startRecording()
      setRecorderStartedAt(Date.now())
    }
  }

  const updateKey = () => {
    setKeeey(keeey + 1)
  }

  const startRecording = () => {
    setRecord(true)
  }

  const stopRecording = () => {
    setRecord(false)
  }

  const onTimeClick = () => {
    if (record && Date.now() - recorderStartedAt >= 5000) {
      onNSeconds()
      updateKey()
    }
  }

  const onNSeconds = () => {
    stopRecording()
    setRecorderStartedAt(Date.now())
    startRecording()
  }

  const onStop = (aud) => {
    console.log(aud, lastBlob)
    // setAttendanceData({ present: [2, 1, 3, 5], absent: [4] })
    let formData = new FormData()

    if (lastBlob)
      formData.append(
        "prevAudio",
        new File(
          [lastBlob.blob],
          `audioPrev-${Math.random()
            .toString(36)
            .substring(2)}.wav`,
          { type: "audio/wav" },
        ),
      )

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

    Axios.post("http://localhost:8080/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((dat) => console.log(dat))
      .catch((err) => console.log(err))

    setLastBlob(aud)
  }

  return (
    <>
      <MicComponent
        key={keeey}
        record={record}
        bgCol={background.default}
        stCol={secondary.light}
        onStop={onStop}
        onClick={onTimeClick}
      />
      <Button
        size="medium"
        variant="contained"
        onClick={recordButtonClick}
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
              You have said
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
