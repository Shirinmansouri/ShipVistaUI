import React, { useEffect, useRef, useState } from 'react';
import {  toastConfig } from '../Config';
import { Form, Row, Col, Button } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import {  makeStyles } from '@material-ui/core/styles';
import { CardComponent } from '../component/UI/CardComponent'
import checkRequests from '../component/ErrroHandling';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {CreatePlants} from '../commonConstants/apiUrls';
const useStyles = makeStyles(theme => ({
    divider: {
      height: theme.spacing(2),
    },
    root: {
      width: '100%',
      marginTop: theme.spacing(3),
    },
    inputBackGround: {
      background: '#f8f8f8',
      border: '2px solid black',
      float: 'left'
    },
    Labels: {
        float: 'left'
      },
    table: {
      minWidth: 750,
    },
    tableWrapper: {
      overflowX: 'auto',
    },
    rootDiv: {
      flexGrow: 1,
    },
    container: {
      flexGrow: 1,
      position: 'relative',
    },
    paper: {
      // position: 'absolute',
      zIndex: 1,
      marginTop: theme.spacing(1),
    },
    chip: {
      margin: theme.spacing(0.5, 0.25),
    },
    inputRoot: {
      flexWrap: 'wrap',
    },
    inputInput: {
      width: 'auto',
      flexGrow: 1,
    }
  }));

export const CreatePlant=(props)=>{
    const classes = useStyles();
    const titleRef=  useRef();
    const fileUploadRef = useRef();
    const [startDate, setStartDate] = useState(new Date());
    const notifySuccess = (title) => toast(title, { duration: toastConfig.duration, style: toastConfig.successStyle });
    const notifyError = (Title) => toast(Title, { duration: toastConfig.duration, style: toastConfig.errorStyle });
    function validatieUiForm(){
        if(titleRef.current.value===''){
            notifyError("Name Is Required");
            return false;
        }
        return true;
            
    }


    function save(e){
      e.preventDefault();
        if(validatieUiForm()==true){
            var data  = {
                Name:titleRef.current.value,
                LastWateringDate:startDate,
            }
            axios.post(CreatePlants, data).then((response)=>{
                if(response.data.hasError===true){
                    notifyError(response.data.responseMessage);
                }
                else {
                  titleRef.current.value="";
                    notifySuccess("The Operation Was Succeed");
                }
            }).catch((error)=>{
                notifyError(error.errorMessage);
            })
        }

    }
    return (
        <>      
        <div className={classes.rootDiv} >
          <div className="row">
            <div className="col-md-12">
              <CardComponent
                beforeCodeTitle="Create New Plant"      
                codeBlockHeight="400px">
                <Form style={{ border: '1px solid rgb(201, 211, 255)', padding: '21px' }}>
                  <Form.Group>
                    <Row className='marg-t-10'>
                      <Col md='4'>
                      </Col>
                    </Row>
                    <div className="separator separator-dashed my-7"></div>
                    <Row >
                      <Col md='4' style={{marginTop: '20px !important' }}>
                        <Form.Label style={{float:'left'}} className={classes.Labels,'custom-label bold'} >Name</Form.Label>
                        <Form.Control className={classes.inputBackGround, 'custom-label marg-t-20 bold'} placeholder="Name" ref={titleRef}></Form.Control>
                      </Col>
                    </Row>
                    <div className="separator separator-dashed my-7"></div>
                    <Row >
                      <Col md='4' style={{marginTop: '20px !important' }}>
                        <Form.Label style={{float:'left'}} className={classes.Labels,'custom-label bold'} >Last Watering Date</Form.Label>
                        <DatePicker selected={startDate} onChange={date => setStartDate(date)} ></DatePicker>
                      </Col>
                    </Row>
                    <div className="separator separator-dashed my-7"></div>
                    <Row >
                      <Col md='4' style={{marginTop: '20px !important' }}>
                        <Button  type="primary" onClick={save}>save</Button>
                      </Col>
                    </Row>
                  </Form.Group>
                </Form>
              </CardComponent>
            </div>
          </div>
          <Toaster position={toastConfig.position} />
        </div>
      </>
      );
}

export default checkRequests(CreatePlant,axios);
