const switcher = document.querySelectorAll('.switcher__item');
const down = document.querySelector('.down-arrow');
const addAdj = document.querySelector('.table__adjacency_add');
const adjTable = document.querySelector('.table__adjacency_table');
const root = document.documentElement;

switcher.forEach(element => {
    element.addEventListener('click', () => {
        if(!element.classList.contains('switcher__item_active')){
            switcher.forEach(element => {
                element.classList.toggle('switcher__item_active');
            });
        }
    });
});

down.addEventListener('click', () => {
    document.querySelector('#mynetwork').classList.toggle('down');
    down.classList.toggle('down-arrow_flip');
    document.querySelector('.overlay').classList.toggle('overlay_active');

    //VIS

    var parseData = vis.parseDOTNetwork(tableAdjacency.dotString());

    // create a network
    var container = document.querySelector('#mynetwork');

    // provide the data in the vis format
    var data = {
        nodes: parseData.nodes,
        edges: parseData.edges
    };
    var options = {};

    // initialize your network!
    var network = new vis.Network(container, data, options);
});

//=============================================

let tableAdjacency = {
    init: false,
    rows: 0,
    columns: 0,
    curIndex: 0,
    matrix: [],
    addEl() {
        this.rows++;
        this.columns++;
        this.curIndex++;
        this.init = true;
    },
    renderAdjTable() {
        if(!(this.init)) {
            return;
        }

        let injectString = `<div></div>`;
        this.matrix = [];
        
        for(let i = 0; i < this.columns; i++) {
            injectString += `<div>x${i + 1}</div>`;
            let subArr = [];
            for(let j = 0; j < this.columns; j++) {
                subArr.push(0);
            }
            this.matrix.push(subArr);
        }

        for(let i = 0; i < this.rows; i++) {
            injectString += `<div>x${i + 1}</div>`;
            for(let j = 0; j < this.columns; j++) {
                injectString += `<div class='clickable'>0</div>`;
            }
        }

        root.style.setProperty('--adjCol', this.columns + 1);
        root.style.setProperty('--adjRow', this.rows + 1);
        adjTable.innerHTML = injectString;

        document.querySelectorAll('.clickable').forEach( (item, i) => {
            item.addEventListener('click', () => {
                if(item.innerHTML == '-1') {
                    item.innerHTML = '0';
                    this.matrix[Math.floor(i / this.columns)][i % this.columns] = '0';
                    return;
                }
                this.matrix[Math.floor(i / this.columns)][i % this.columns] = '1';
                item.innerHTML = '1';
            });
        });
        document.querySelectorAll('.clickable').forEach( (item, i) => {
            item.addEventListener('contextmenu', (ev) => {
                ev.preventDefault();
                if(item.innerHTML == '1') {
                    item.innerHTML = '0';
                    this.matrix[Math.floor(i / this.columns)][i % this.columns] = '0';
                    return;
                }
                item.innerHTML = '-1';
                this.matrix[Math.floor(i / this.columns)][i % this.columns] = '-1';
            });
        });
    },
    dotString() {
        let dotStr = 'dinetwork {';

        for(let i = 0; i < this.columns; i++) {
            for(let j = 0; j < this.rows; j++) {
                if(this.matrix[i][j] == 1) {
                    dotStr += `x${i + 1} -> x${j + 1}; `;
                }
                else if(this.matrix[i][j] == 0) {
                    dotStr += `x${i + 1}; `;
                }
                else {
                    dotStr += `x${j + 1} -> x${i + 1}; `;
                }
            }
        }

        dotStr = dotStr.slice(0, dotStr.length - 2);
        return dotStr + '}';
    }
};

addAdj.addEventListener('click', () => {
    tableAdjacency.addEl();
    tableAdjacency.renderAdjTable();
});

VanillaTilt.init(document.querySelectorAll(".table__adjacency, .table__incidency"), {
    max: 5,
    speed: 400,
    glare: true,
    "max-glare": 0.2,
    reverse: true,
    perspective: 1000,
});




