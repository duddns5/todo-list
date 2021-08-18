let renderCurrentTime = () =>{
	
	let now = new Date();
	let hour = now.getHours();
	let minutes = now.getMinutes();
	let seconds = now.getSeconds();
	
	hour = hour < 10?"0"+hour:hour;
	minutes = minutes < 10?"0"+minutes:minutes;
	seconds = seconds < 10?"0"+seconds:seconds;
	document.querySelector('.txt_clock').innerHTML = `${hour} : ${minutes} : ${seconds}`;
	
}

let renderUser = (event) => {
	let input = document.querySelector('.inp_username').value;
	localStorage.setItem('username',input);
	//넘어온 value값을 스토리지에 저장.
	convertMainDiv(input);
}

let registSchedule = (event) => {
	
	let prevTodo = localStorage.getItem('todo');
	let input = document.querySelector('.inp_todo').value;
	let todoList = [];
	
	if(input == ''){
		return;
	}else{
		if(prevTodo){
			todoList = JSON.parse(prevTodo);
			let idx = Number(localStorage.getItem('lastIdx')) + 1;
			localStorage.setItem('lastIdx',idx);
			todoList.unshift({work:input,idx:idx});
		}else{
			localStorage.setItem('lastIdx',0);
			todoList.unshift({work:input, idx:0});
		}
	}
	
	localStorage.setItem('todo',JSON.stringify(todoList));
	renderSchedule(todoList.slice(0,8));
}

let removeSchedule = event => {
	let curPage = Number(document.querySelector('#currentPage').textContent);
	let todoList = JSON.parse(localStorage.getItem('todo'));
	let removedList = todoList.filter(e => {
		return event.target.dataset.idx != e.idx;
	});
	
	console.dir(removedList);
	localStorage.setItem('todo',JSON.stringify(removedList));
	
	let end = curPage * 8;
	let begin = end - 8;
	renderSchedule(removedList.slice(begin,end));
	
}

let renderSchedule = (todoList) => {
	document.querySelectorAll('.todo-list>div').forEach(e => {e.remove()});
	document.querySelector('.inp_todo').value='';
	todoList.forEach(removeSchedule => {
		let workDiv = document.createElement('div');
		workDiv.innerHTML = `<i class="far fa-trash-alt" data-idx="${removeSchedule.idx}"></i> ${removeSchedule.work}`;
		document.querySelector('.todo-list').append(workDiv);
	});
	
	document.querySelectorAll('.todo-list>div>i').forEach(e => {
		e.addEventListener('click', removeSchedule)
	})
		
}

let renderNextPage = () => {
	}

let renderPagination = (event) => {
	//1. 현재 페이지
	let dir = Number(event.target.dataset.dir);
	let curPage = Number(document.querySelector('#currentPage').textContent);
	//2. 전체 페이지 수
	let lastPage;
	let randerPage = curPage + dir;
	let todoList = localStorage.getItem('todo');
	
	if(todoList){
		todoList = JSON.parse(todoList);
		let todoCnt = todoList.length;
		//3. 페이지당 뿌릴 데이터 숫자.
		lastPage = Math.ceil(todoCnt/8);
	}
	
	if(randerPage > lastPage){
		alert('마지막 페이지 입니다.');
		return;
	}
	
	if(randerPage < 1){
		return;
	}
	
	let end = randerPage * 8;
	let begin = end-8;
	
	renderSchedule(todoList.slice(begin,end));
	document.querySelector('#currentPage').textContent = randerPage;
}

let renderPrevPage = () => {
	/*let curPage = Number(document.querySelector('#currentPage').textContent);
	
	let todoList = localStorage.getItem('todo');
	if(todoList){
		todoList = JSON.parse(todoList);
	}
	
	if(curPage == 1){
		return;
	}
	
	let renderPage = curPage-1;
	let end = renderPage * 8;
	let begin = end-8;
	
	renderSchedule(todoList.slice(begin,end));
	document.querySelector('#currentPage').textContent = renderPage;*/
}

let convertMainDiv = (username) => {
	document.querySelector('.username').innerHTML = username;
	document.querySelector('.inp_username').placeholder = 'Enter your schedule';
	document.querySelector('.inp_username').value = '';
	
	document.querySelector('.wrap_username').className = 'box_todo';
	document.querySelector('.frm_username').className = 'frm_todo';
	document.querySelector('.inp_username').className = 'inp_todo';
	
	//이름을 입력했을때 좌측todolist창 띄워주면서 스타일값(input태그쪽) 변경처리
	document.querySelector('.main').style.justifyContent='space-between';
	document.querySelector('.wrap_todo').style.marginRight='20vw';
	document.querySelector('.todo-list').style.display='block';
	
	document.querySelector('.frm_todo').removeEventListener('submit',renderUser);
	document.querySelector('.frm_todo').addEventListener('submit',registSchedule);
	document.querySelector('#leftArrow').addEventListener('click',renderPagination);
	document.querySelector('#rightArrow').addEventListener('click',renderPagination);
}

(() => {
	
	let username = localStorage.getItem('username');
	let todoList = localStorage.getItem('todo');
	
	if(username){ //사용자가 등록을 진행했다면, 
		convertMainDiv(username);
		if(todoList){
			todoList = JSON.parse(todoList);
			renderSchedule(todoList.slice(0,8));	
		}
	}else{
		document.querySelector('.frm_username').addEventListener('submit', renderUser);
	}
	
	setInterval(renderCurrentTime,1000);
})();


