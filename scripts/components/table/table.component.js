import TableTemplate from 'ejs!templates/table/table.ejs';
import TableTopTemplate from 'ejs!templates/table/tableTop.ejs';
// import { json as d3_json } from 'd3-request';

export default class {
  constructor(value) {

    var actors = [
      {
        title: [
          {
            'name': 'municipallities',
            'units': ''
          },
          {
            'name': 'TRADE AMOUNT',
            'units': 'tons'
          },
          {
            'name': 'DEFORESTATION',
            'units': 'ha'
          },
          {
            'name': 'WATER SCARCITY',
            'units': 'mm/ha'
          },
          {
            'name': 'CONFLICTS',
            'units': ''
          },
          {
            'name': 'FIRES',
            'units': ''
          }
        ]
      },
      {
        data: [
          {
            'municipalities': [
              {
                'value': 'Quêrencia',
                'unit': ''
              }
            ],
            'trade': [
              {
                'value': '2,864',
                'unit': 'tons'
              }
            ],
            'deforastation': [
              {
                'value': '53',
                'unit': 'ha'
              }
            ],
            'water': [
              {
                'value': '53',
                'unit': 'mm/ha'
              }
            ],
            'conflict': [
              {
                'value': '53',
                'unit': ''
              }
            ],
            'fire': [
              {
                'value': '53',
                'unit': ''
              }
            ]
          },
          {
            'municipalities': [
              {
                'value': 'Quêrencia',
                'unit': ''
              }
            ],
            'trade': [
              {
                'value': '2,863',
                'unit': 'tons'
              }
            ],
            'deforastation': [
              {
                'value': '53',
                'unit': 'ha'
              }
            ],
            'water': [
              {
                'value': '53',
                'unit': 'mm/ha'
              }
            ],
            'conflict': [
              {
                'value': '53',
                'unit': ''
              }
            ],
            'fire': [
              {
                'value': '53',
                'unit': ''
              }
            ]
          },
          {
            'municipalities': [
              {
                'value': 'Quêrencia',
                'unit': ''
              }
            ],
            'trade': [
              {
                'value': '2,863',
                'unit': 'tons'
              }
            ],
            'deforastation': [
              {
                'value': '53',
                'unit': 'ha'
              }
            ],
            'water': [
              {
                'value': '53',
                'unit': 'mm/ha'
              }
            ],
            'conflict': [
              {
                'value': '53',
                'unit': ''
              }
            ],
            'fire': [
              {
                'value': '53',
                'unit': ''
              }
            ]
          },
          {
            'municipalities': [
              {
                'value': 'Quêrencia',
                'unit': ''
              }
            ],
            'trade': [
              {
                'value': '2,863',
                'unit': 'tons'
              }
            ],
            'deforastation': [
              {
                'value': '53',
                'unit': 'ha'
              }
            ],
            'water': [
              {
                'value': '53',
                'unit': 'mm/ha'
              }
            ],
            'conflict': [
              {
                'value': '53',
                'unit': ''
              }
            ],
            'fire': [
              {
                'value': '53',
                'unit': ''
              }
            ]
          }
        ]
      }
    ];

    var consumers = [
      {
        trader:[
          {
            'name': 'Craig',
            'value' : '33'
          }
        ]
      }];

    if(value === 'top'){
      this.data = consumers;
    }
    else {
      this.data = actors;
    }
    this.render(value);
  }

  render(value) {
    if(value === 'top'){
      const template = TableTopTemplate({actors: this.data});
      document.querySelector('.contain-table').innerHTML = template;
    }else {
      const template = TableTemplate({actors: this.data});
      document.querySelector('.contain-table').innerHTML = template;
    }
  }
}
