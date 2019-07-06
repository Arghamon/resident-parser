const lineReader = require("line-reader");
const fs = require('fs');
let aId = 0;
let qId = 0;
let category = '';
const platform = process.platform;

const regex = {
	isQuestion: test => {
		return /^\d./.test(test);
  },
  isAnswer: test => {
		return /^[ა-ზ]\)/.test(test) || /^\*/.test(test);
	},
	isCorrectAnswer: test => {
		return /^\*/.test(test);
  }
}

// console.log(regex.isAnswer('*ა) კუკუ'))

let target = "./questions/all.txt";
let data = [];
lineReader.eachLine(target, function(line, last) {
	data.push(line);
	if(last){
		getItems(data);
	}
});

let answers = [];
let answerItem = {};

function getItems(data){
	let result = [];
	let item = [];
	for(let i in data){
		if (data[i] !== ''){
			item.push(data[i])
		}else{
			result.push(item)
			item = [];
		}
	}
	arrangeData(result)
}



let itemTemplate = {
  id: 0,
  question:
    "The 4:25 bus to the airport has a travel time of 1 hour and 45 minutes. The bus is running late today though.",
  answers: [
    { q_id: 0, id: 1, value: "val 1", isCorrect: false },
    { q_id: 0, id: 2, value: "val 2", isCorrect: false },
    { q_id: 0, id: 3, value: "val 3", isCorrect: true },
    { q_id: 0, id: 4, value: "val 4", isCorrect: false }
  ]
};

function arrangeData(data){
	let final = [];
	for(let i in data){
		let line = data[i];	
		if(line.length < 4 ){
			for (let k in line){
				if(line[k].length > 2){
					console.log(line[k])
					category = line[k];
				}
			}
		}else{
			let item = {};
			let answers = [];
			for(let j in line){
				if(regex.isQuestion(line[j])){
					qId += 1;
					item['id'] = qId;
					item['question'] = line[j];
					item['cat'] = category;
				}
				if(regex.isAnswer(line[j])){
					let answerItem = {};
					aId += 1;
					answerItem['q_id'] = qId;
					answerItem['id'] = aId;
					answerItem['value'] = line[j];
					answerItem['isCorrect'] = regex.isCorrectAnswer(line[j])	
					answers.push(answerItem);
				}
			}
			item['answers'] = answers;
			final.push(item)
			aId = 0;
		}
	}

	let txtTarget = platform == 'win32' ? '..\\resident-evil\\src\\data\\test.json' : '../projects/resident-evil/src/data/test.json'

	fs.writeFile(txtTarget, JSON.stringify(final), function (err) {
		if (err) throw err;
		console.log('Replaced!');
	});
}