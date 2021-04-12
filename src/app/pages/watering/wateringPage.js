import React from 'react';
import WateringsList from './WateringsList';
import axios from 'axios';
import checkRequests from '../component/ErrroHandling';

export class wateringPage extends React.Component {
    constructor(){
        super();
    }

    render() {
            return (
                <>
                    <WateringsList></WateringsList>
                </>
            );
    }
}

export default checkRequests(wateringPage,axios);