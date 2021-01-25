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
    const [checkProgress, setCheckProgress] = useState(0)
    const [checkStatus, setCheckStatus] = useState(false)

    async function readFile(e){
      e.preventDefault();
      const reader = new FileReader();
      reader.onload = async function (e){
        const text = e.target.result;
        console.log(text);
        setBulkText(text);
      }
      reader.readAsText(e.target.files[0]);
    }

    async function checkAndAddStudents(){
      let students = bulkText.split('\n').map(a => a.trim());
      let p = 0;
      setOpen(false)
      setCheckStatus(true)
      for(let i = 0; i < students.length; i += 10){
        let tempStudents = students.splice(i, 10);
        await checkStudents(tempStudents)
          .then(data => {
            setInvalidStudents(invalidStudents.concat(data.invalid_students))
            addInvitedStudents(data.valid_students)
            p += tempStudents.length;
            setCheckProgress(Math.min(100, (p/students.length * 100).toFixed(0)));
          });
          console.log(i);
          console.log(checkProgress);
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
                    <label htmlFor="upload-file">
                      <input
                        style={{ display: 'none' }}
                        id="upload-file"
                        name="upload-file"
                        type="file"
                        onChange={(e) => readFile(e)}
                      />
                      <Button variant="contained" component="span">
                        Upload file
                      </Button>
                    </label>
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
              <Typography>
                <CircularProgress variant="static" value={checkProgress} />
                {checkProgress}%
              </Typography>
              {invalidStudents.length > 0 ? (
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
              ) : (
                <Typography>
                  No invalid students
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button disabled={checkProgress < 100} onClick={() => closeStatus()}>
                 Close   
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
    )
}