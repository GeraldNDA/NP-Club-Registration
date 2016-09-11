/*
	Developer: Gerald Aryeetey
	Program: Club Management
	Student Number: 473215
	Class: ICS3UR-C
	Teacher: Mr. P. Brown
	Version: 1.0.0
	Description: This program that tracks present, excused and away students based on user input from website. 
	As well, creates graphs based on attendance and allows teachers to manage the club by adding, 
	deleting and modifying points of students.
*/
var students = []; // array of student object
var userName, passWord, sort; // username, password and sort property values (not preset
var dates = [];
var attendanceRecord = [];
var present = []; // list of all present students
var excused = []; // list of all excused students
//change the state of the checkbox from checked to unchecked to indeterminate(excused)
var currentCheckbox;
function changeCheckState(element){
	currentCheckbox = element;
	switch(currentCheckbox.dataset["checked"])
	{
		case "0":
			//currently checked, set to unchecked
			currentCheckbox.dataset["checked"] = "1";
			currentCheckbox.checked = "";
			break;
		case "1":
			//currently unchecked, set to excused
			currentCheckbox.dataset["checked"] = "2";
      currentCheckbox.checked = "";
      currentCheckbox.indeterminate = true;
			break;
		default:
			//currently excused, set to checked
			currentCheckbox.dataset["checked"] = "0";
			currentCheckbox.checked = "checked";
			currentCheckbox.indeterminate = false;
			break;
	};
};
//deletes the element from the DOM and removes it from the string
function deleteFromDOM(element)
{
	//remove from properties
	var current = element.parentNode.parentNode.parentNode;
	var studentID = parseInt(current.getAttribute("name").substr(-1)) - 1;
	current.parentNode.removeChild(current);
	
	//delete from array and remove from attendance list
	var inputID = "student" + current.getAttribute("name").substr(-1)
	var attendanceElement = document.getElementById(inputID).parentElement;
	attendanceElement.parentElement.removeChild(attendanceElement);
	for(var i = 0; i < students.length; i++)
	{
		if(students[i].studentID === inputID)
		{
			students.splice(i, 1)
		}
	};
}


function addToDOM(fName, lName, attendance, studentID, points, percentAttendance)
{
		//create DOM structure for new student in attendance list
		var newStudent = document.createElement('div');
		var newStudentCheck = document.createElement('input');
		var newStudentName = document.createElement('label');
		var newStudentPercent = document.createElement('label');
		
		newStudent.setAttribute('class', 'student');
		
		var nameString = fName + " " +lName;
		
		nameString = nameString.replace(/\b./g, function(m){ return m.toUpperCase(); });
		
		setAttributes(newStudentCheck, {
			"type": "checkbox",
			"name":  studentID,
			"value":  studentID,
			"id":  studentID,
			"checked": "checked",
			"data-checked": "0"
		})
		setAttributes(newStudentName, {
			"for": studentID,
			"class":"name"
		})
		setAttributes(newStudentPercent, {
			"for": studentID,
			"class":"percent"
		})
		
		
		newStudentName.innerHTML = nameString;
		newStudentPercent.innerHTML = percentAttendance+"&#37";
		newStudentCheck.onclick = function()
		{
			changeCheckState(this);
		}
		newStudentCheck.checked = "checked";
		attendance.appendChild(newStudent);
		newStudent.appendChild(newStudentCheck);
		newStudent.appendChild(newStudentName);
		newStudent.appendChild(newStudentPercent);
		
		//create DOM structure for new student in settings panel
		var settings = document.getElementById("settings");
		var ssettings = document.createElement('div');
		var simage = document.createElement('img');
		var sinfo = document.createElement('div');
		var sname = document.createElement('h4');
		var spoints = document.createElement('div');
		var sdelete = document.createElement('div');
		setAttributes(ssettings, {
			"name": studentID,
			"class":"ssetting"
		})
		simage.setAttribute('src', 'http://placehold.it/50x50');
		sinfo.setAttribute('class', 'sinfo');
		sinfo.value = points;
		spoints.setAttribute('class', 'spoints');
		sdelete.setAttribute('class', 'sdelete');
		spoints.innerHTML = "Points: <span>" + points + "</span> <button>+</button> <button>-</button>";
		sdelete.innerHTML = "<button> Delete?</button>";
		sname.innerHTML = nameString;
		// add functionality to buttons (+/- points, delete student)
		sdelete.getElementsByTagName("button")[0].onclick = function()
		{
			deleteFromDOM(this);
		};
		spoints.getElementsByTagName("button")[0].onclick= function()
		{
			var student = this.parentElement.parentElement;
			student.value += 1;
			var studentID = student.parentElement.getAttribute("name");
			for(var i = 0; i < students.length; i++)
			{
				if(students[i].studentID === studentID)
				{
					students[i].points += 1;
				}
			};
			student.getElementsByTagName("span")[0].innerHTML =student.value;
		}; //+
		spoints.getElementsByTagName("button")[1].onclick	 = function()
		{
			var student = this.parentElement.parentElement;
			student.value -= 1;
			var studentID = student.parentElement.getAttribute("name");
			for(var i = 0; i < students.length; i++)
			{
				if(students[i].studentID === studentID)
				{
					students[i].points -= 1;
				}
			};
			student.getElementsByTagName("span")[0].innerHTML =student.value;
		};//-
		settings.appendChild(ssettings);
		ssettings.appendChild(simage);
		ssettings.appendChild(sinfo);
		sinfo.appendChild(sname);
		sinfo.appendChild(spoints);
		sinfo.appendChild(sdelete);
}

// helper functions (set multiple attributes at once, check if studentID is in array, find index of object in array, find percentage based on )
function setAttributes(element, attributes) 
{
  for(var property in attributes) 
	{
    element.setAttribute(property, attributes[property]);
  }
}
function isIn(value, array) 
{
  return array.indexOf(value) > -1;
}
function indexOfObjectArray(myArray, searchTerm, property) 
{
	for(var i = 0, len = myArray.length; i < len; i++) 
	{
		if (myArray[i][property] === searchTerm) return i;
	}
	return -1;
}
function findPercentage(string)
{
	var string = string.replace(/e/gi, "");
	var present = string.split("p").length - 1;
	return ((present/string.length)*100) || 0;
	
}
window.onload = function(){
	students = JSON.parse(localStorage.getItem("students" )|| "[]");
	dates = JSON.parse(localStorage.getItem("dates")|| "[]");
	attendanceRecord = JSON.parse(localStorage.getItem("record") || "[]");

	//change tab based on hash
	if(document.getElementsByClassName("tabRadio")[0] !== undefined)
	{
		if(location.hash == "#attendance")
		{
			document.getElementsByClassName("tabRadio")[0].checked = true;
		}
		else if (location.hash == "#statistics")
		{
			document.getElementsByClassName("tabRadio")[1].checked = true;
		}
		else if (location.hash == "#settings")
		{
			document.getElementsByClassName("tabRadio")[2].checked = true;
		}
		else
		{
			document.getElementsByClassName("tabRadio")[0].checked = true;
		}
	}
	if(document.forms["attendance"] !== undefined)
	{
		var attendance = document.forms["attendance"]; // attendance 
		for(var i = 0; i < students.length; i++)
		{
			addToDOM(students[i].firstName, students[i].lastName, attendance, students[i].studentID, students[i].points, students[i].attendance[0])
		};
		//if indeterminate:  add to excused array, checked: add to present array
		
		attendance.onsubmit = function()
		{
			var currentDate = new Date();
			var submitDate = currentDate.getMonth().toString() + " " +currentDate.getDate().toString()+ " "+ currentDate.getFullYear().toString();
			
			var attendanceString = "";
			for(var i = 0; i < attendance.length; i++)
			{
				if (attendance[i].getAttribute("type") !== "submit")
				{
					if(attendance[i].checked && !attendance[i].indeterminate)
					{
						attendanceString += "p" + attendance[i].value.substr(7);
					}
					else if(attendance[i].indeterminate)
					{
						attendanceString += "e" + attendance[i].value.substr(7);
						
					}
					else
					{
						attendanceString += "a" + attendance[i].value.substr(7);
					}
				};
			}
			// if submitDate is in dates ... overwrite the attendanceString in record
			if(isIn(submitDate,dates))
			{				
				var location = dates.indexOf(submitDate);
				var record = attendanceRecord[location].split("");
				for(var j = 0; j < record.length; j+= 2)
				{
					var student = "student" + record[j + 1];
					var studentPos = indexOfObjectArray(students, student, "studentID");
					if (studentPos > -1)
					{
						if(record[j] === "p")
						{
							students[studentPos].points -= 1;
						}
						else if(record[j] === "a")
						{
							students[studentPos].points += 1;
						}
						students[studentPos].attendance[1] = students[studentPos].attendance[1].substring(0, students[studentPos].attendance[1].length - 1);
					}
				}
				attendanceRecord[location] = attendanceString;
				//for every recorded attendance, search for the student then increase points for present, keep same for excused otherwise lose points for absent
				var record = attendanceString.split("");
				for(var j = 0; j < record.length; j+= 2)
				{
					var student = "student" + record[j + 1];
					var studentPos = indexOfObjectArray(students, student, "studentID");
					if (studentPos > -1)
					{
						if(record[j] === "p")
						{
							students[studentPos].points += 1;
							students[studentPos].attendance[1] += "p"
						}
						else if(record[j] === "a")
						{
							students[studentPos].points -= 1;
							students[studentPos].attendance[1] += "a"
						}
						else
						{
							students[studentPos].attendance[1] += "e"
						}
					}
					students[studentPos].attendance[0] = findPercentage(students[studentPos].attendance[1]);
					var thisStudentLabel = document.getElementById(student);
					thisStudentLabel = thisStudentLabel.parentElement.getElementsByClassName("percent")[0];
					thisStudentLabel.innerHTML = students[studentPos].attendance[0] +"&#37";
					var thisStudent = document.getElementsByName(student)[1];
					thisStudent.getElementsByTagName("span")[0].innerHTML = students[studentPos].points; 
				}
			}
			else
			{
				dates.push(submitDate);
				attendanceRecord.push(attendanceString);
				//for every recorded attendance, search for the student then increase points for present, keep same for excused otherwise lose points for absent
				var record = attendanceString.split("");
				for(var j = 0; j < record.length; j+= 2)
				{
					var student = "student" + record[j + 1];
					var studentPos = indexOfObjectArray(students, student, "studentID");
					if (studentPos > -1)
					{
						if(record[j] === "p")
						{
							students[studentPos].points += 1;
							students[studentPos].attendance[1] += "p"
						}
						else if(record[j] === "a")
						{
							students[studentPos].points -= 1;
							students[studentPos].attendance[1] += "a"
						}
						else
						{
							students[studentPos].attendance[1] += "e"
						}
						students[studentPos].attendance[0] = findPercentage(students[studentPos].attendance[1]);
						var thisStudentLabel = document.getElementById(student);
						thisStudentLabel = thisStudentLabel.parentElement.getElementsByClassName("percent")[0];
						thisStudentLabel.innerHTML = students[studentPos].attendance[0] +"&#37"
						var thisStudent = document.getElementsByName(student)[1];
						thisStudent.getElementsByTagName("span")[0].innerHTML = students[studentPos].points; 
					}
				}
				
			}
			//add attendance to each student (add date to an array)
			//change attendance based on date array
			//alert(present);
			//alert(excused);
		};
	}
	// login form
	if (document.forms["login"] !== undefined)
	{
		var login = document.forms["login"];
		login.onsubmit = function () {
			userName = login["username"].value;
			passWord = login["password"].value;
			//alert(userName);
			//alert(passWord);
		};
	}
	/*
	// add a checked value to each checkbox, cycle through checked, indeterminate and unchecked states
	for(var i = 0; i < attendance.length; i++)
    {
      attendance[i].dataset["checked"] = "0";
			attendance[i].checked = "checked";
			if(attendance[i].type === "checkbox")
			{
				attendance[i].onclick = function()
				{
					changeCheckState(this);
				}
				
			}
		};
		*/
	// record sort attendance property
	var property = document.getElementById("property");
	property.onchange = function()
	{
		var index = property.selectedIndex;
		sort = property.options[index].value;
		//alert(sort);
	};
	/*
	//increment or decrement points on button press 
	for (var index = 0; index < document.getElementsByClassName("spoints").length; index++)
	{
		document.getElementsByClassName("spoints")[index].parentElement.value = 1;
		document.getElementsByClassName("spoints")[index].getElementsByTagName("button")[0].onclick= function()
		{
			var student = this.parentElement.parentElement;
			student.value += 1;
			//var studentID = parseInt(student.parentElement.getAttribute("name").substring(-1)) - 1;
			//students[studentID].points += 1;
			//alert(students[studentID].points);
			//alert(student);
			student.getElementsByTagName("span")[0].innerHTML =student.value;
		}; //+
		document.getElementsByClassName("spoints")[index].getElementsByTagName("button")[1].onclick	 = function()
		{
			var student = this.parentElement.parentElement;
			student.value -= 1;
			//var studentID = parseInt(student.parentElement.getAttribute("name").substring(-1)) - 1;
			//students[studentID].points -= 1;
			//alert(students[studentID].points);
			//alert(student);
			student.getElementsByTagName("span")[0].innerHTML =student.value;
		}; //-
	};
	// delete element on delete student press
	for (var i= 0; i < document.getElementsByClassName("sdelete").length; i++)
	{
		document.getElementsByClassName("sdelete")[i].getElementsByTagName("button")[0].onclick = function()
		{
			deleteFromDOM(this);
		}; //delete element from DOM
	};
	*/
	//key board shortcuts for modal window
	document.onkeydown = function(e){
		var pressedKeyValue = e.keyCode;
		//esc key changes target ... if inside of modal window
		if(pressedKeyValue == 27 && location.hash == "#modal")
		{
			location.hash = "";
		}
		
	};
	var modal = document.forms.modal;
	//if you click outside the modal window, close the window
	document.getElementById("modal").onmousedown = function()
	{
		location.hash = "";
	};
	modal.onmousedown = function(e)
	{	
		e.stopPropagation();
	};
	//add student objects to students array
	modal.onsubmit = function()
	{
		if(students.length !== 0)
		{
		var previousStudent = students[students.length - 1].studentID;
		var studentLength = parseInt(previousStudent.substr(7))+1;
		}
		else
		{
			studentLength = 1;
		}
		alert(studentLength);
		students.push({
			firstName: modal[0].value,
			lastName: modal[1].value,
			studentNumber: modal[2].value,
			points: 1,
			studentID: "student" + studentLength.toString(),
			attendance: [0, ""], //% attendance and attendance string 
			//add attendance of each student
		});
		
		//alert added student information
		var student = students.length - 1
		//alert(students[student].studentID);
		addToDOM(students[student].firstName, students[student].lastName, attendance, students[student].studentID, students[student].points, students[student].attendance[0])
		location.hash = "";
	}
	
	// record change of graph properties
	// graph canvas --> style = http://tinychart.co/
	
	
};
window.onbeforeunload = function(e)
{
	
	var studentArray = JSON.stringify(students);
	localStorage.setItem("students", studentArray);
	
	var datesArray = JSON.stringify(dates);
	localStorage.setItem("dates", datesArray);
	
	var recordArray = JSON.stringify(attendanceRecord);
	localStorage.setItem("record", recordArray);
}
