import React, { useEffect } from 'react';
import {CardComponent} from '../component/UI/CardComponent'
import Skeleton from 'react-loading-skeleton';
import editImage from '../waterDesignImages/edit1.svg';
import { Form, Row, Col, Button,FormGroup } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import { faIR } from '@material-ui/core/locale';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EnhancedTableHead from '../component/UI/EnhancedTableHead';
import { tableConfig,toastConfig } from '../Config';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import {GetAllPlants,StartWateringApi} from '../commonConstants/apiUrls';
import { useDispatch, useSelector } from "react-redux";
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import Toolbar from '@material-ui/core/Toolbar';
import checkRequests from '../component/ErrroHandling';
import {GETCancelRequest,CANCELREQUEST} from '../_redux/Actions/wateringActions';

import { truncate } from 'lodash';

const headRows = [
  { id: 'id', numeric: true, disablePadding: true, label: 'Id' },
  { id: 'Name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'LastWateringDate', numeric: true, disablePadding: false, label: 'LastWateringDate' },
  { id: 'Status', numeric: true, disablePadding: false, label: 'Status' },
  { id: 'Operation', numeric: true, disablePadding: false, label: 'Operation' },
  { id: 'Timer', numeric: true, disablePadding: false, label: 'Cancel Time' },
];
  
  
  function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  
  function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
  }
  
  function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
  }
  

  const useToolbarStyles = makeStyles(theme => ({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
          color: '#8950FC',
          backgroundColor: '#f3f6f9',
        }
        : {
          color: '#8950FC',
          backgroundColor: '#f3f6f9',
        },
    spacer: {
      flex: '1 1 100%',
    },
    title: {
      flex: '0 0 auto',
    },
  }));
  
  const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const { numSelected } = props;
    return (
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
      >
        <div className={classes.title}>
          {numSelected > 0 ? (
            <Typography color="inherit" variant="subtitle1">
              {numSelected} Number Rows Selected   
            </Typography>
          ) : (
              <Typography variant="h6" id="tableTitle">
                <span className='tabelhead'>Watergin List</span>
              </Typography>
            )}
        </div>
        <div className={classes.spacer} />
      </Toolbar>
    );
  };

  const useStyles = makeStyles(theme => ({
    divider: {
      height: theme.spacing(2),
    },
    root: {
      width: '100%',
      marginTop: theme.spacing(3),
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
    tableWrapper: {
      overflowX: 'auto',
    },
  }));

  const theme = createMuiTheme({
    direction: 'rtl',
    palette: {
      primary: {
        main: '#8950FC',
      },
      secondary: {
        main: '#8950FC',
      },
    },
  }, faIR);


  
  export function WateringsList(props) {
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [rows, setRows] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(20);
    const [isLoading, setIsLoading] = React.useState(true);
    const reduxProps = useSelector(state=>state.planetReducer);
     
    const dispatch = useDispatch();
    const notifyError = () => toast('Error In Server Contact Admin', { duration: toastConfig.duration, style: toastConfig.errorStyle });
    function createData(id, Name,LastWateringDate,plantsStatus,statusName,timer,clickCancel) {
      return {  id,Name,LastWateringDate,plantsStatus,statusName,timer,clickCancel};
    }

    const setFakeData = (count) => {
      const temp = [];
      for (let i = 0; i < count; i++) {
        temp.push({ id: i });
      }
      setRows(temp);
    }
    useEffect(() => {
      setFakeData(tableConfig.rowsPerPageDefault);
      getData();
    }, []);
    
    function handleRequestSort(event, property) {
      const isDesc = orderBy === property && order === 'desc';
      setOrder(isDesc ? 'asc' : 'desc');
      setOrderBy(property);
    }
  
    function handleSelectAllClick(event) {
      if (event.target.checked) {
        const newSelecteds = rows.map(n => n.id);
        setSelected(newSelecteds);
        return;
      }
      setSelected([]);
    }
    const isSelected = id => selected.indexOf(id) !== -1;
  
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  
    const getData = () => {
      axios.get(GetAllPlants)
        .then(res=>{
          let result = res.data.plants;
          let temp = [];
          for (let i = 0; i < rowsPerPage * (page - 1); i++) {
            temp.push({});
          }
          result.forEach(item => {
            temp.push(createData(item.id,item.name,item.lastWateringDate,item.plantsStatus,item.statusName,0,false))
          });
          setRows(temp);
          setIsLoading(false);

        })
        .catch(error => {
          notifyError();
          setIsLoading(true);
        });
    }
    const wateringEvent=(e)=>{

      let rowItem = e.currentTarget.getAttribute('row');
      var data = JSON.parse(rowItem);
      if(e.currentTarget.textContent === "Cancel Watering"){
        e.currentTarget.textContent = "Start Watering";
        var CancelTokenRequestObj = reduxProps.token.filter((z=>z.id==data.id))[0].cancelToken;
        CancelTokenRequestObj.cancel();
        data.timer=0;
        data.clickCancel = false;
        updateList(data);
      }else{
        const cancelTokenSource = axios.CancelToken.source();
        e.currentTarget.textContent = "Cancel Watering";//for change label btn
        data.timer=10;
        data.clickCancel = true;
        updateList(data);
        dispatch(CANCELREQUEST({
          cancelToken: cancelTokenSource,
          id:data.id,
        }));//for save source Request based id in redux for new Request

        axios.post(StartWateringApi,data,{
          cancelToken: cancelTokenSource.token
        }).then((response)=>{
          if(response!=undefined){
            if(response.data.hasError===false){
              e.currentTarget.textContent = "Start Watering";
              e.currentTarget.disabled='disabled';
            }
          }

        });
      }

    }

    
    useEffect(() => {
      console.log(`initializing interval`);
      const interval = setInterval(() => {
        anaylizeList();
      }, 1000);
    
      return () => {
        console.log(`clearing interval`);
        clearInterval(interval);
      };
    }, [rows]); 

    const updateList=(item)=>{

      var tmpArray = rows;
      var foundIndex = tmpArray.findIndex(z=>z.id==item.id);
      tmpArray[foundIndex]=item;

      var tmp=[];
      tmpArray.map((item,index)=>{
        tmp.push(item);
      })
      setRows([]);
      setRows(tmp);
    }

    const anaylizeList =()=>{
      var tmpArray = rows;
      tmpArray.map((item,index)=>{
        if(item.timer>0){
          item.timer = item.timer-1;
          if(item.timer===0){
            item.plantsStatus=2;
            item.timer=0;
            item.clickCancel = false;
            item.statusName = 'Watered';
            console.log("status Changed",item.id," : ",item);
          }
          updateList(item);
          console.log("timer",item.id," : ",item);
        }
      })
    }
    
    const btnSearch=(e)=>{
      getData();
      setPage(0);
    }
    
    return (
      <>
        <div className="row">
        <div className="col-md-12">
          <CardComponent>
              <FormGroup>

                  <Row>
                    <Col md='4'>
                      <Form.Label className='custom-label marg-t-20 bold' style={{float:'left'}}>Plant's Name</Form.Label>
                      <Form.Control    className='form-control-custom' as="input" />
                    </Col>
                    <Col md='2'  style={{marginTop: '17px'}}>
                    <Form.Label className='custom-label marg-t-20 bold'></Form.Label>
                      <Button onClick={(e)=>{btnSearch()}}>Search</Button>
                    </Col>
                </Row>
              </FormGroup>
          </CardComponent>
        </div>
      </div>
      <div className={classes.root}>
      <CardComponent>
        <ThemeProvider theme={theme}>
        <Paper className={classes.paper}>
          <EnhancedTableToolbar numSelected={selected.length} selected={selected}   />
          <div className={classes.tableWrapper}>

            <Table
              className={classes.table + ' marg-t-10'}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
                headRows={headRows}
              />
              <TableBody>
                {stableSort(rows, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    
                    return (
                      <>
                        <TableRow
                          hover
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={index + 'usersList'}
                          selected={isItemSelected}
                          style={{background:row.plantsStatus===1? '#f64e60':''}}
                        >
                          <TableCell align="center">
                            <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                            <div style={{ display: !isLoading ? 'block' : 'none' }}>
                              {row.id}
                            </div>
                          </TableCell>
                          <TableCell align="center">
                            <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                            <div style={{ display: !isLoading ? 'block' : 'none' }}>
                              {row.Name}
                            </div>
                          </TableCell>
                          <TableCell align="center">
                            <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                            <div style={{ display: !isLoading ? 'block' : 'none' }}>
                              {row.LastWateringDate}
                            </div>
                          </TableCell>
                          <TableCell align="center">
                            <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                            <div style={{ display: !isLoading ? 'block' : 'none' }}>
                              {row.statusName}
                            </div>
                          </TableCell>
                          <TableCell className={classes.cell_short} align="center">
                            <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                            <div style={{ display: !isLoading ? 'block' : 'none' }}>
                                <Button  dbid={row.id} disabled={row.plantsStatus===2?'disabled':''} onClick={wateringEvent} row={JSON.stringify(row)}  type="primary">{row.clickCancel===true?'Cancel Watering':'Start Watering'}</Button>
                            </div>
                          </TableCell>
                          <TableCell align="center">
                            <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                            <div style={{ display: !isLoading ? 'block' : 'none' }}>
                              {row.plantsStatus===1?row.timer:''}
                            </div>
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 49 * emptyRows, display: 'none' }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Paper>
      </ThemeProvider>
      </CardComponent>
      <Toaster position={toastConfig.position} />
    </div>
  
      </>

    );
  }



export default checkRequests(WateringsList,axios);