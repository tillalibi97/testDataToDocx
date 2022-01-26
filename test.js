const fs = require('fs');
const axios = require('axios');
const docx = require('docx');
const { Document, Packer, Paragraph, TextRun, Header, Table, TableCell, TableRow, WidthType } = docx;

const url = 'http://jsonplaceholder.typicode.com/posts?userId=1';

async function getReadyFile() {

    let res = await axios.get(url);
    let data = res.data;
    let dateOfCreation = res.headers.date;
    for (let i = 0; i < 10; i++) {
        let userId = data[i]['userId'].toString();
        let id = data[i]['id'].toString();
        let title = data[i]['title'];
        let body = data[i]['body'];
        generateRows(userId, id, title, body);
    }
    createDoc(table, dateOfCreation);
}

const table = new Table({
    rows : [
        new TableRow({
            children : [
                new TableCell({
                    children : [new Paragraph({
                        children : [
                            new TextRun({
                                text: 'User Id',
                                bold: true,
                            }),
                        ],
                    })],
                }),
                new TableCell({
                    children : [new Paragraph({
                        width: {
                            size: 300,
                            type: WidthType.DXA,
                        },
                        children: [
                            new TextRun({
                                text : 'Id',
                                bold : true,
                            }),
                        ],
                    })],
                }),
                new TableCell({
                    children : [new Paragraph({
                        children: [
                            new TextRun({
                                text : 'Title',
                                bold : true,
                            }),
                        ],
                    })],
                }),
                new TableCell({
                    children : [new Paragraph({
                        children: [
                            new TextRun({
                                text : 'Body',
                                bold : true,
                            }),
                        ],
                    })],
                }),
            ],
        }),
    ]
})

function generateRows(a, b, c, d) {
    let tableRow = new TableRow({
        children : [
            new TableCell({
                children : [new Paragraph(a)],
            }),
            new TableCell({
                width: {
                    size: 300,
                    type: WidthType.DXA,
                },
                children : [new Paragraph(b)],
            }),
            new TableCell({
                children : [new Paragraph(c)],
            }),
            new TableCell({
                children : [new Paragraph(d)],
            }),
        ],
    });
    table.root.push(tableRow);
};


function createDoc(table, dateOfCreation) {
    // const dataStringified = JSON.stringify(data);
    const doc = new Document({
        sections: [{
            properties: {},
            headers: {
                default: new Header({
                    children: [new Paragraph(dateOfCreation)],
                }),
            },
            children: [table,],
        }],
    });

// Used to export the file into a .docx file
    Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync("My Document.doc", buffer);
    });
}
getReadyFile()