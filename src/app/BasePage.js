import React, {Suspense, lazy,useEffect} from "react";
import {Redirect, Switch, Route} from "react-router-dom";
import {LayoutSplashScreen, ContentRoute} from "../_metronic/layout";
import {
  wateringPath,
  CreatePlantPath
} from './pages/commonConstants/RouteConstant';
import WateringPage from './pages/watering/wateringPage';
import CreatePlantPage from './pages/watering/CreatePlants';

export default function BasePage() {
  useEffect(()=>{
    document.getElementsByClassName('container')[0].style.margin = 0;
    document.getElementsByClassName('container')[0].style.width = '100%';
    document.getElementsByClassName('container')[0].style.paddingLeft = '28px';
    document.getElementsByClassName('container')[0].style.maxWidth = '1850px';
    document.getElementsByClassName('container')[0].style.marginTop = '-68px';
  },[]);

    return (
        <Suspense fallback={<LayoutSplashScreen/>}>
              <Switch>
                {
                    <ContentRoute exact from="/" component={CreatePlantPage}></ContentRoute>
                }
                <ContentRoute path={wateringPath} component={WateringPage}></ContentRoute>
                <ContentRoute path={CreatePlantPath} component={CreatePlantPage}></ContentRoute>
                <Redirect to={CreatePlantPath}/>
            </Switch>
        </Suspense>
    );
}
