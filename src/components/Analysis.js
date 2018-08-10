import React from 'react';
import '../style/analysis.css';
import { Line, Doughnut } from '../../node_modules/react-chartjs-2';

class Analysis extends React.Component {

    constructor(props) {
        super(props);

        this.state = {getState: 
            {
                labels: [
                  'First Aid Society',
                  'IT Society',
                  'Sport Club'
                ],
                datasets: [{
                  data: [this.getRandomInt(50, 200), this.getRandomInt(100, 150), this.getRandomInt(150, 250)],
                  backgroundColor: [
                  '#FF6384',
                  '#36A2EB',
                  '#FFCE56'
                  ],
                  hoverBackgroundColor: [
                  '#FF6384',
                  '#36A2EB',
                  '#FFCE56'
                  ]
                }]
              }}

    }

    getRandomInt (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
	componentDidMount() {
		setInterval(() => 5000);
    }
    
    render() {

        const data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
              {
                label: 'My First dataset',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [65, 59, 80, 81, 56, 55, 40]
              }
            ]
          };

          
        return (
            <div className="outerDiv">
                {/* <div style={{width:400, height: 350}}>
                    <h2>Line Example</h2>
                    <Line data={data} />
                </div> */}

                <div style={{width:400, height: 350}}>
                    <h2>Top 3 Famous Events</h2>
                    <Doughnut data={this.state.getState} />
                </div>
          </div>
        );
    }
    
}

export default Analysis;