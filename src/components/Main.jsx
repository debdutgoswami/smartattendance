import React, { useState } from "react"
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  makeStyles,
  CssBaseline,
} from "@material-ui/core"
import Brightness4Icon from "@material-ui/icons/Brightness4"
import Brightness7Icon from "@material-ui/icons/Brightness7"
import MenuIcon from "@material-ui/icons/Menu"
import AttendanceComponent from "./AttendanceComponent"
import "../styles.css"

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  toolbar: theme.mixins.toolbar,
  attendanceComp: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
}))

function Main() {
  const classes = useStyles()

  const savedTheme = localStorage.getItem("theme") || "light"
  localStorage.setItem("theme", savedTheme)

  const [theme, setTheme] = useState({
    palette: {
      type: savedTheme,
    },
  })

  const toggleTheme = () => {
    let newPalleteType = theme.palette.type === "light" ? "dark" : "light"
    setTheme({
      palette: {
        type: newPalleteType,
      },
    })
    localStorage.setItem("theme", newPalleteType)
  }

  const muiTheme = createMuiTheme(theme)

  return (
    <MuiThemeProvider theme={muiTheme}>
      <AppBar color="default" position="fixed">
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            edge="start"
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Smart Attendance
          </Typography>
          <IconButton onClick={toggleTheme} edge="end">
            {theme.palette.type === "light" ? (
              <Brightness4Icon />
            ) : (
              <Brightness7Icon />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Background Theme Color */}
      <CssBaseline />

      {/* Spacing under toolbar */}
      <div className={classes.toolbar} />

      {/* Main App */}
      <div className={classes.attendanceComp}>
        <AttendanceComponent palette={muiTheme.palette} />
      </div>
    </MuiThemeProvider>
  )
}

export default Main
