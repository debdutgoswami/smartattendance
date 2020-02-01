import React from "react"
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  makeStyles,
} from "@material-ui/core"

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  tabCont: {
    marginTop: "25px",
  },
})

function LiveTable(props) {
  const classes = useStyles()

  const rx = props.attendanceData
  let row = []

  if (rx !== null) {
    for (var ind in rx.present) {
      row.push({ rollNo: rx.present[ind], status: "Present" })
    }

    for (ind in rx.absent) {
      row.push({ rollNo: rx.absent[ind], status: "Absent" })
    }
  }

  row.sort((a, b) => {
    if (a.rollNo > b.rollNo) return 1
    else return -1
  })

  return (
    <TableContainer className={classes.tabCont} component={Paper}>
      <Table className={classes.table} size="small" aria-label="Live Table">
        <TableHead>
          <TableRow>
            <TableCell width="160px">Roll Number</TableCell>
            <TableCell>Present/Absent</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {row.map(({ rollNo, status }, id) => (
            <TableRow key={id}>
              <TableCell width="160px" component="th" scope="row">
                {rollNo}
              </TableCell>
              <TableCell>{status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default LiveTable
