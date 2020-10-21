import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid'
import { Typography, TextField, Button, CircularProgress } from '@material-ui/core';
import { checkStudents } from '../../api/courseService';
import { invalid } from 'moment';

export default function BulkAddStudents({
    open,
    setOpen,
    addInvitedStudents
}){

    const [bulkText, setBulkText] = useState("")
    const [invalidStudents, setInvalidStudents] = useState([])
    const [validStudents, setValidStudents] = useState([])
    const [checkStudentStatus, setStudentStatus] = useState({})
    const [checkStatus, setCheckStatus] = useState(false)

    function checkAndAddStudents(){
      let students = bulkText.split('\n')
      setStudentStatus({length: students.length, progress: 0})
      setOpen(false)
      setCheckStatus(true)
      for(let i = 0; i < students.length; i += 10){
        let tempStudents = students.splice(i, i + 10)
        checkStudents(tempStudents)
          .then(data => {
            setInvalidStudents(invalidStudents.concat(data.invalid_students))
            addInvitedStudents(data.valid_students)
            setStudentStatus({...checkStudentStatus, progress: i/students.length*100})
          })
      }
    }

    function closeStatus(){
      setCheckStatus(false)
      setValidStudents([])
      setInvalidStudents([])
    }

    return (
        <React.Fragment>
          <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
              <DialogTitle>
                  Bulk Add Students
              </DialogTitle>
              <DialogContent>
                  <form>
                    <TextField 
                      multiline
                      fullWidth
                      label="GitHub usernames on each line"
                      style={{height: "200px"}}
                      rows={8}
                      value={bulkText}
                      onChange={(e) => setBulkText(e.target.value)}
                    />
                  </form>
              </DialogContent>
              <DialogActions>
                  <Button onClick={() => checkAndAddStudents()}>
                      Add
                  </Button>
                  <Button onClick={() => setOpen(false)}>
                      Cancel
                  </Button>
              </DialogActions>
          </Dialog>
          <Dialog open={checkStatus}>
            <DialogContent>
              <CircularProgress variant="static" value={checkStudentStatus.progress} />
              {invalidStudents.length > 0 && (
                <React.Fragment>
                  <DialogContentText>
                    Could not find usernames:
                  </DialogContentText>
                  <ul>
                  {invalidStudents.map((student, idx) => (
                    <li key={idx}>{student}</li>
                  ))}
                  </ul>
                </React.Fragment>
              )}
            </DialogContent>
            <DialogActions>
              <Button disabled={checkStudentStatus.progress <= 1} onClick={() => closeStatus()}>
                 Close   
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
    )
}