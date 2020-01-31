import React, { useState } from "react"
import {
  Button,
  Card,
  makeStyles,
  CardContent,
  Typography,
} from "@material-ui/core"
import MicComponent from "./MicComponent"

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

  const [record, setRecord] = useState(false)
  const [said, setSaid] = useState("")
  const [recorderStartedAt, setRecorderStartedAt] = useState(Date.now())

  const toggleRecord = () => {
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
    console.log("onStop", aud)
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
        color={record ? "primary" : "secondary"}
      >
        Record
      </Button>
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
