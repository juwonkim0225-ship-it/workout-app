let workouts = [];

try{

    workouts =
        JSON.parse(
            localStorage.getItem("workouts")
        ) || [];

}

catch{

    alert(
        "저장 데이터 오류 감지\n백업 파일 복원을 권장합니다."
    );

    workouts = [];

}

let graphPoints = [];

let currentDate = "";
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

const chest = [
    "벤치프레스",
    "인클라인 벤치프레스",
    "덤벨프레스",
    "인클라인 덤벨프레스",
    "체스트프레스",
    "딥스",
    "케이블 플라이",
    "펙덱 플라이"
];

const back = [
    "랫풀다운",
    "풀업",
    "바벨로우",
    "덤벨로우",
    "시티드로우",
    "티바로우",
    "데드리프트",
    "원암 덤벨로우"
];

const shoulder = [
    "숄더프레스",
    "덤벨 숄더프레스",
    "사이드 레터럴 레이즈",
    "프론트 레이즈",
    "리어 델트 플라이",
    "업라이트 로우",
    "아놀드 프레스",
    "페이스풀"
];

const arm = [
    "바벨컬",
    "덤벨컬",
    "해머컬",
    "프리처컬",
    "케이블푸쉬다운",
    "라잉 트라이셉스 익스텐션",
    "오버헤드 익스텐션",
    "클로즈그립 벤치프레스"
];

const lower = [
    "스쿼트",
    "레그프레스",
    "레그컬",
    "레그익스텐션",
    "런지",
    "힙쓰러스트",
    "루마니안 데드리프트",
    "카프레이즈"
];

let savedWeight =
    localStorage.getItem(
        "todayBodyWeight"
    );

if(savedWeight){

    document.getElementById(
        "bodyWeight"
    ).value =
    savedWeight;

}

document
.getElementById("saveButton")
.addEventListener(
    "click",
    saveWorkout
);

function updateExercises(){

    let part =
        document.getElementById("part").value;

    let exercise =
        document.getElementById("exercise");

    exercise.innerHTML =
        '<option value="">운동 선택</option>';

    let list = [];

    if(part === "가슴"){
        list = chest;
    }

    if(part === "등"){
        list = back;
    }

    if(part === "어깨"){
        list = shoulder;
    }

    if(part === "팔"){
        list = arm;
    }

    if(part === "하체"){
        list = lower;
    }

    list.forEach(item=>{

        exercise.innerHTML +=
        `<option value="${item}">
            ${item}
        </option>`;

    });

}

function createCalendar(){

    let calendar =
        document.getElementById("calendar");

    calendar.innerHTML = "";

    document.getElementById(
        "monthTitle"
    ).innerText =

    `${currentYear}년 ${currentMonth+1}월`;

    let firstDay =
        new Date(
            currentYear,
            currentMonth,
            1
        ).getDay();

    firstDay =
        (firstDay + 6) % 7;

    for(let i=0;i<firstDay;i++){

        calendar.appendChild(
            document.createElement("div")
        );

    }

    let days =
        new Date(
            currentYear,
            currentMonth+1,
            0
        ).getDate();

    let today =
        new Date();

    for(let i=1;i<=days;i++){

        let fullDate =

            currentYear + "-" +

            String(
                currentMonth+1
            ).padStart(2,"0")

            + "-"

            +

            String(i)
            .padStart(2,"0");

        let day =
            document.createElement("div");

        day.className = "day";

        if(

            today.getDate() === i &&

            today.getMonth()
            === currentMonth &&

            today.getFullYear()
            === currentYear

        ){

            day.innerText = "TODAY";
            day.classList.add("today");

        }

        else{

            day.innerText = i;

        }

        let count = workouts.filter(
            x=>x.date===fullDate
        ).length;

        if(count > 0){

            day.classList.add(
                "record"
            );

            let badge =
                document.createElement("span");

            badge.className =
                "recordCount";

            badge.innerText = count;

            day.appendChild(
                badge
            );

        }

        if(
            currentDate===fullDate
        ){

            day.classList.add(
                "selected"
            );

        }

        day.onclick = ()=>{

            currentDate =
                fullDate;

            document
            .getElementById(
                "selectedDate"
            )
            .innerText =
            fullDate;

            document
            .getElementById(
                "workoutSection"
            )
            .style.display =
            "block";

            createCalendar();

            showRecords();

updateDayPreview();

updateVolume();

updateStats();

updateGoalWeight();

updateStreak();

updateGraphExerciseList();

drawExerciseGraph();

drawBodyGraph();

        };

        calendar.appendChild(day);

    }

}

function prevMonth(){

    currentMonth--;

    if(currentMonth < 0){

        currentMonth = 11;
        currentYear--;

    }

    createCalendar();
updateGraphTitle();
drawExerciseGraph();
drawBodyGraph();

}

function nextMonth(){

    currentMonth++;

    if(currentMonth > 11){

        currentMonth = 0;
        currentYear++;

    }

    createCalendar();
updateGraphTitle();
drawExerciseGraph();
drawBodyGraph();

}

function saveWorkout(){

    if(currentDate===""){

        alert(
            "날짜를 선택하세요"
        );

        return;

    }

    let exercise =
        document
        .getElementById(
            "exercise"
        ).value;

    let weight =
        Number(
            document
            .getElementById(
                "weight"
            ).value
        );

    let sets =
        Number(
            document
            .getElementById(
                "sets"
            ).value
        );

    let reps =
        Number(
            document
            .getElementById(
                "reps"
            ).value
        );

    let bodyWeight =
        Number(
            document
            .getElementById(
                "bodyWeight"
            ).value
        );

    if(
        !exercise ||
        !weight ||
        !sets ||
        !reps ||
        !bodyWeight
    ){

        alert(
            "전부 입력하세요"
        );

        return;

    }

    if(weight <= 0){

        alert(
            "무게는 0보다 커야 합니다"
        );

        return;

    }

    if(sets <= 0 || sets > 50){

        alert(
            "세트는 1~50"
        );

        return;

    }

    if(reps <= 0 || reps > 100){

        alert(
            "횟수는 1~100"
        );

        return;

    }

    if(
        bodyWeight < 20 ||
        bodyWeight > 300
    ){

        alert(
            "체중을 확인하세요"
        );

        return;

    }

    workouts.push({

        date:
            currentDate,

        exercise:
            exercise,

        weight:
            weight,

        sets:
            sets,

        reps:
            reps,

        bodyWeight:
            bodyWeight

    });

    localStorage.setItem(

        "workouts",

        JSON.stringify(
            workouts
        )

    );

    document
    .getElementById(
        "weight"
    ).value = "";

    document
    .getElementById(
        "sets"
    ).value = "";

    document
    .getElementById(
        "reps"
    ).value = "";

    document
    .getElementById(
        "bodyWeight"
    ).value = "";

    refreshAll();
updateWeeklyReport();

updateMonthlyReport();

}

function showRecords(){

    let list =
        document.getElementById(
            "list"
        );

    list.innerHTML = "";

    workouts
    .filter(
        x=>x.date===currentDate
    )
    .reverse()
    .forEach(item=>{

        let index =
            workouts.indexOf(
                item
            );

        let title =
            item.type === "cardio"
            ? "유산소"
            : item.exercise;

        let first =
            item.type === "cardio"
            ? item.speed + "km/h"
            : item.weight + "kg";

        let second =
            item.type === "cardio"
            ? item.reps + "분"
            : item.sets + "세트";

        let third =
            item.type === "cardio"
            ? item.calories + "kcal"
            : item.reps + "회";

        list.innerHTML +=

        `
        <li>

        ${title}
        |

        ${first}
        |

        ${second}
        |

        ${third}

        <button onclick="editWorkout(${index})">
        수정
        </button>

        <button onclick="deleteWorkout(${index})">
        삭제
        </button>

        </li>
        `;

    });

}

function deleteWorkout(index){

    if(
        !confirm(
            "정말 삭제할까요?"
        )
    ){
        return;
    }

    workouts.splice(
        index,
        1
    );

    localStorage.setItem(

        "workouts",

        JSON.stringify(
            workouts
        )

    );

    refreshAll();

}
function updateGraphExerciseList(){

    let select =
        document.getElementById(
            "graphExercise"
        );

    let current =
        select.value;

    select.innerHTML =
        '<option value="">운동 선택</option>';

    let names =

        [
            ...new Set(
                workouts.map(
                    x=>x.exercise
                )
            )
        ];

    names.forEach(name=>{

        select.innerHTML +=

        `<option value="${name}">
            ${name}
        </option>`;

    });

    if(
        names.includes(
            current
        )
    ){

        select.value =
        current;

    }

}
function updateGraphTitle(){

    let title =
        document.querySelector(
            "#graphSection h2"
        );

    if(title){

        title.innerText =
        currentYear + "년 " +
        (currentMonth+1) +
        "월 성장 그래프";

    }

}

function toggleGraphs(){

    let graph =

    document
    .getElementById(
        "graphSection"
    );

    if(
        graph.style.display
        ===
        "block"
    ){

        graph.style.display =
        "none";

    }

    else{

        graph.style.display =
        "block";

    }

}

function updateStats(){

    let prStats =
        document.getElementById(
            "prStats"
        );

    let monthStats =
        document.getElementById(
            "monthStats"
        );

    let prMap = {};

    workouts.forEach(w=>{

        if(
            !prMap[w.exercise]
            ||
            w.weight >
            prMap[w.exercise]
        ){

            prMap[w.exercise]
            =
            w.weight;

        }

    });

    let top5 =

        Object.entries(prMap)

        .sort(
            (a,b)=>
            b[1]-a[1]
        )

        .slice(0,5);

    if(top5.length===0){

        prStats.innerHTML =
        "기록 없음";

    }

    else{

        prStats.innerHTML =

        top5.map(x=>

            `${x[0]}
            :
            ${x[1]}kg`

        ).join("<br>");

        let cards =
            document.getElementById(
                "prCards"
            );

        if(cards){

            cards.innerHTML = "";

            top5.forEach(x=>{

                if(x[0] === "유산소"){
                    return;
                }

                cards.innerHTML +=

                `
                <div class="prCard">

                    <div class="prCardName">
                        ${x[0]}
                    </div>

                    <div class="prCardWeight">
                        ${x[1]}kg
                    </div>

                </div>
                `;

            });

        }

    }

    let monthPrefix =

        currentYear
        + "-"
        +
        String(
            currentMonth+1
        ).padStart(2,"0");

    let monthData =

        workouts.filter(
            x=>
            x.date.startsWith(
                monthPrefix
            )
        );

    let workoutDays =

        new Set(
            monthData.map(
                x=>x.date
            )
        ).size;

    let workoutCount =
        monthData.length;

    let bodyDiff = 0;

    let currentWeight =
        "-";

    if(
        monthData.length >= 2
    ){

        bodyDiff =

            monthData[
                monthData.length-1
            ].bodyWeight

            -

            monthData[0]
            .bodyWeight;

    }

    if(
        monthData.length > 0
    ){

        currentWeight =

        monthData[
            monthData.length-1
        ].bodyWeight

        + "kg";

    }

    monthStats.innerHTML =

    `
    운동일 : ${workoutDays}일<br>
    운동횟수 : ${workoutCount}회<br>
    체중변화 : ${bodyDiff.toFixed(1)}kg<br>
    현재체중 : ${currentWeight}
    `;
}

updateStats();

updateGoalWeight();

updateStreak();
function drawLine(canvasId,data,key){

    let canvas =
        document.getElementById(
            canvasId
        );

    let ctx =
        canvas.getContext("2d");

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.strokeStyle =
        "white";

    ctx.fillStyle =
        "white";

    ctx.lineWidth = 2;

    if(data.length < 2){

        ctx.fillText(
            "기록 2개 이상 필요",
            20,
            40
        );

        return;
    }

    data.sort(
        (a,b)=>
        new Date(a.date)
        -
        new Date(b.date)
    );

    let max =
        Math.max(
            ...data.map(
                x=>x[key]
            )
        );

    let min =
        Math.min(
            ...data.map(
                x=>x[key]
            )
        );

    let points = [];

graphPoints = [];

    for(
        let i=0;
        i<data.length;
        i++
    ){

        let x =
            60 +
            i *
            (
                650 /
                (
                    data.length-1
                )
            );

        let y =
            240 -

            (
                (
                    data[i][key]
                    -
                    min
                )
                /
                (
                    max-min || 1
                )
            )

            *170;

        points.push({

            x:x,
            y:y,
            value:data[i][key],
            date:data[i].date
        });

        graphPoints.push({
            x:x,
            y:y,
            value:data[i][key],
            date:data[i].date
        });

    }

    ctx.beginPath();

    ctx.moveTo(
        points[0].x,
        points[0].y
    );

    for(
        let i=1;
        i<points.length;
        i++
    ){

        ctx.lineTo(
            points[i].x,
            points[i].y
        );

    }

    ctx.stroke();

    points.forEach(p=>{

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            4,
            0,
            Math.PI*2
        );

        ctx.fill();

        ctx.fillText(
            p.value,
            p.x-10,
            p.y-10
        );

        ctx.fillText(
            p.date.slice(5),
            p.x-15,
            280
        );

    });

}

function drawExerciseGraph(){

    let selected =
        document.getElementById(
            "graphExercise"
        ).value;

    let monthPrefix =
        currentYear + "-" +
        String(currentMonth+1).padStart(2,"0");

    let data =

        workouts.filter(
            x=>
            x.exercise === selected &&
            x.date.startsWith(monthPrefix)
        );

    drawLine(
        "exerciseGraph",
        data,
        "weight"
    );

}

function drawBodyGraph(){

    let monthPrefix =
        currentYear + "-" +
        String(currentMonth+1).padStart(2,"0");

    let data =
        workouts.filter(
            x=>x.date.startsWith(monthPrefix)
        );

    drawLine(
        "bodyGraph",
        data,
        "bodyWeight"
    );

}
function editWorkout(index){

    let item = workouts[index];

    currentDate = item.date;

    document
    .getElementById("selectedDate")
    .innerText = item.date;

    document
    .getElementById("workoutSection")
    .style.display = "block";

    document
    .getElementById("weight")
    .value = item.weight;

    document
    .getElementById("sets")
    .value = item.sets;

    document
    .getElementById("reps")
    .value = item.reps;

    document
    .getElementById("bodyWeight")
    .value = item.bodyWeight;

    if(chest.includes(item.exercise)){
    document.getElementById("part").value = "가슴";
}

if(back.includes(item.exercise)){
    document.getElementById("part").value = "등";
}

if(shoulder.includes(item.exercise)){
    document.getElementById("part").value = "어깨";
}

if(arm.includes(item.exercise)){
    document.getElementById("part").value = "팔";
}

if(lower.includes(item.exercise)){
    document.getElementById("part").value = "하체";
}

    if(
        lower.includes(item.exercise)
    ){
        document
        .getElementById("part")
        .value = "하체";
    }

    updateExercises();

    document
    .getElementById("exercise")
    .value = item.exercise;

    workouts.splice(index,1);

    localStorage.setItem(
        "workouts",
        JSON.stringify(workouts)
    );

    createCalendar();

    showRecords();

updateDayPreview();

updateVolume();

}
function refreshAll(){

    createCalendar();

    showRecords();

updateDayPreview();

updateVolume();

updateStats();

updateGoalWeight();

updateStreak();

    updateGraphExerciseList();

    drawExerciseGraph();

    drawBodyGraph();

updateVolume();

}
function updateDayPreview(){

    let preview =
        document.getElementById(
            "dayPreview"
        );

    let records =

        workouts.filter(
            x=>x.date===currentDate
        );

    if(records.length===0){

        preview.innerHTML =
        "기록 없음";

        return;

    }

    preview.innerHTML =

        records.map(x=>

            x.type === "cardio"
            ? `유산소 ${x.calories}kcal`
            : `${x.exercise} ${x.weight}kg`

        ).join("<br>");

}
function updateStreak(){

    let box =
        document.getElementById(
            "streakBox"
        );

    let dates =

        [
            ...new Set(
                workouts.map(
                    x=>x.date
                )
            )
        ]

        .sort();

    if(dates.length===0){

        box.innerText =
        "🔥 0일 연속 운동";

        return;
    }

    let streak = 1;

    for(

        let i =
        dates.length - 1;

        i > 0;

        i--

    ){

        let current =
            new Date(
                dates[i]
            );

        let previous =
            new Date(
                dates[i-1]
            );

        let diff =

            (
                current -
                previous
            )

            /

            (
                1000 *
                60 *
                60 *
                24
            );

        if(diff === 1){

            streak++;

        }

        else{

            break;

        }

    }

    box.innerText =
        `🔥 ${streak}일 연속 운동`;

}
function updateVolume(){

    let box =
        document.getElementById(
            "volumeBox"
        );

    if(!currentDate){

        box.innerText =
        "🏋️ 오늘 총 운동량 : 0kg";

        return;
    }

    let total = 0;

    workouts

    .filter(
        x=>x.date===currentDate
    )

    .forEach(x=>{

        total +=

            x.weight *

            x.reps *

            x.sets;

    });

    box.innerText =

        `🏋️ 오늘 총 운동량 : ${total.toLocaleString()}kg`;

}
function calculateCardioCalories(){

    let height =
        Number(
            document.getElementById(
                "cardioHeight"
            ).value
        );

    let weight =
        Number(
            document.getElementById(
                "cardioWeight"
            ).value
        );

    let incline =
        Number(
            document.getElementById(
                "incline"
            ).value
        );

    let speed =
        Number(
            document.getElementById(
                "speed"
            ).value
        );

    let time =
        Number(
            document.getElementById(
                "cardioTime"
            ).value
        );

    if(
        !weight ||
        !speed ||
        !time
    ){
        return;
    }

    let met =

        3.5

        +

        (speed * 0.7)

        +

        (incline * 0.25);

    let calories =

        met

        *

        weight

        *

        (time / 60);

    document
    .getElementById(
        "cardioResult"
    )
    .innerText =

    `소모 칼로리 : ${Math.round(calories)} kcal`;

}
function saveCardioWorkout(){

    if(currentDate===""){

        alert("날짜를 선택하세요");

        return;

    }

    let weight =
        Number(
            document.getElementById("cardioWeight").value
        );

    let incline =
        Number(
            document.getElementById("incline").value
        );

    let speed =
        Number(
            document.getElementById("speed").value
        );

    let time =
        Number(
            document.getElementById("cardioTime").value
        );

    if(!weight || !speed || !time){

        alert("몸무게, 속도, 시간 입력");

        return;

    }

    if(weight < 20 || weight > 300){

        alert("체중 오류");

        return;

    }

    if(speed <= 0 || speed > 30){

        alert("속도 오류");

        return;

    }

    if(time <= 0 || time > 600){

        alert("운동시간 오류");

        return;

    }

    let met =
        3.5 +
        (speed * 0.7) +
        (incline * 0.25);

    let calories =
        met *
        weight *
        (time / 60);

    workouts.push({

        date: currentDate,

        exercise: "유산소",

        weight: Math.round(calories),

        sets: 1,

        reps: time,

        bodyWeight: weight,

        type: "cardio",

        speed: speed,

        incline: incline,

        calories: Math.round(calories)

    });

    localStorage.setItem(
        "workouts",
        JSON.stringify(workouts)
    );

    refreshAll();

    alert(
        `유산소 기록 저장 완료\n${Math.round(calories)} kcal`
    );

}
var goalWeight = localStorage.getItem("goalWeight") || "";

function saveGoalWeight(){

    var value =
        document.getElementById("goalWeightInput").value;

    if(!value){
        alert("목표 체중 입력");
        return;
    }

    goalWeight = Number(value);

    localStorage.setItem(
        "goalWeight",
        goalWeight
    );

    updateGoalWeight();

}

function updateGoalWeight(){

    var input =
        document.getElementById("goalWeightInput");

    var result =
        document.getElementById("goalWeightResult");

    if(!input || !result){
        return;
    }

    if(goalWeight){
        input.value = goalWeight;
    }

    var bodyRecords =
        workouts.filter(x=>x.bodyWeight);

    if(!goalWeight){
        result.innerText = "목표 체중 없음";
        return;
    }

    if(bodyRecords.length===0){
        result.innerText = "현재 체중 기록 없음";
        return;
    }

    var current =
        bodyRecords[
            bodyRecords.length-1
        ].bodyWeight;

    var diff =
        current - goalWeight;

    if(diff > 0){
        result.innerText =
            `현재 ${current}kg / 목표까지 ${diff.toFixed(1)}kg 감량`;
    }

    else if(diff < 0){
        result.innerText =
            `현재 ${current}kg / 목표까지 ${Math.abs(diff).toFixed(1)}kg 증량`;
    }

    else{
        result.innerText =
            `현재 ${current}kg / 목표 달성`;
    }

}

updateGoalWeight();
function updateWeeklyReport(){

    let box =
        document.getElementById("weeklyReport");

    if(!box){
        return;
    }

    let now = new Date();

    let day = now.getDay();

    let monday = new Date(now);

    let diff =
        day === 0 ? -6 : 1 - day;

    monday.setDate(
        now.getDate() + diff
    );

    monday.setHours(0,0,0,0);

    let sunday = new Date(monday);

    sunday.setDate(
        monday.getDate() + 6
    );

    sunday.setHours(23,59,59,999);

    let weekData =
        workouts.filter(w=>{

            let d =
                new Date(w.date);

            return d >= monday && d <= sunday;

        });

    if(weekData.length===0){

        box.innerHTML =
        "📅 이번 주 리포트 없음";

        return;

    }

    let workoutDays =
        new Set(
            weekData.map(w=>w.date)
        ).size;

    let workoutCount =
        weekData.length;

    let totalVolume = 0;

    weekData.forEach(w=>{

        if(w.type === "cardio"){
            return;
        }

        totalVolume +=
            w.weight *
            w.sets *
            w.reps;

    });

    let bodyRecords =
        weekData.filter(
            w=>w.bodyWeight
        );

    let bodyDiff = 0;

    if(bodyRecords.length>=2){

        bodyDiff =
            bodyRecords[
                bodyRecords.length-1
            ].bodyWeight

            -

            bodyRecords[0]
            .bodyWeight;

    }

    box.innerHTML =
    `
    📅 이번 주 리포트<br>
    운동일 : ${workoutDays}일<br>
    운동횟수 : ${workoutCount}회<br>
    총 운동량 : ${totalVolume.toLocaleString()}kg<br>
    체중변화 : ${bodyDiff.toFixed(1)}kg
    `;

}
updateWeeklyReport();
function backupData(){

    let data = {
        workouts: workouts,
        goalWeight: localStorage.getItem("goalWeight") || ""
    };

    let json =
        JSON.stringify(
            data,
            null,
            2
        );

    let blob =
        new Blob(
            [json],
            {
                type:"application/json"
            }
        );

    let url =
        URL.createObjectURL(blob);

    let a =
        document.createElement("a");

    a.href = url;

    a.download =
        "workout_backup.json";

    a.click();

    URL.revokeObjectURL(url);

}

function restoreData(event){

    let file =
        event.target.files[0];

    if(!file){
        return;
    }

    let reader =
        new FileReader();

    reader.onload =
        function(e){

            try{

                let data =
                    JSON.parse(
                        e.target.result
                    );

                if(!data.workouts){
                    alert("잘못된 백업 파일");
                    return;
                }

                workouts =
                    data.workouts;

                localStorage.setItem(
                    "workouts",
                    JSON.stringify(workouts)
                );

                if(data.goalWeight){

                    localStorage.setItem(
                        "goalWeight",
                        data.goalWeight
                    );

                }

                alert("복원 완료");

                refreshAll();

                updateWeeklyReport();

                if(
                    typeof updateGoalWeight
                    === "function"
                ){
                    updateGoalWeight();
                }

            }

            catch(error){

                alert("파일을 불러올 수 없음");

            }

        };

    reader.readAsText(file);

}
function saveTodayWeight(){

    let weight =
        document.getElementById(
            "bodyWeight"
        ).value;

    if(!weight){
        return;
    }

    localStorage.setItem(
        "todayBodyWeight",
        weight
    );

    alert(
        "체중 저장 완료"
    );

}
function changeWeight(diff){

    let input =
        document.getElementById(
            "weight"
        );

    let current =
        Number(input.value) || 0;

    let next =
        current + diff;

    if(next < 0){

        next = 0;

    }

    input.value =
        next;

}
function loadLastRecord(){

    let exercise =
        document.getElementById(
            "exercise"
        ).value;

    if(!exercise){
        return;
    }

    let records =

        workouts.filter(
            x=>
            x.exercise ===
            exercise
        );

    if(
        records.length===0
    ){
        return;
    }

    let last =
        records[
            records.length-1
        ];

    document.getElementById(
        "weight"
    ).value =
    last.weight;

    document.getElementById(
        "sets"
    ).value =
    last.sets;

    document.getElementById(
        "reps"
    ).value =
    last.reps;

}
createCalendar();
function updateMonthlyReport(){

    let box =
        document.getElementById("monthlyReport");

    if(!box){
        return;
    }

    let monthPrefix =
        currentYear + "-" +
        String(currentMonth+1).padStart(2,"0");

    let monthData =
        workouts.filter(
            x=>x.date.startsWith(monthPrefix)
        );

    if(monthData.length===0){
        box.innerHTML = "📆 이번 달 리포트 없음";
        return;
    }

    let workoutDays =
        new Set(
            monthData.map(x=>x.date)
        ).size;

    let totalVolume = 0;

    monthData.forEach(x=>{

        if(x.type === "cardio"){
            return;
        }

        totalVolume +=
            x.weight * x.sets * x.reps;

    });

    let bodyRecords =
        monthData.filter(x=>x.bodyWeight);

    let bodyDiff = 0;

    if(bodyRecords.length >= 2){

        bodyDiff =
            bodyRecords[bodyRecords.length-1].bodyWeight
            -
            bodyRecords[0].bodyWeight;

    }

    let mostExercise = "-";

    let countMap = {};

    monthData.forEach(x=>{

        countMap[x.exercise] =
            (countMap[x.exercise] || 0) + 1;

    });

    let sorted =
        Object.entries(countMap)
        .sort((a,b)=>b[1]-a[1]);

    if(sorted.length > 0){
        mostExercise = sorted[0][0];
    }

    box.innerHTML =
    `
    📆 이번 달 리포트<br>
    운동일 : ${workoutDays}일<br>
    운동횟수 : ${monthData.length}회<br>
    총 운동량 : ${totalVolume.toLocaleString()}kg<br>
    체중변화 : ${bodyDiff.toFixed(1)}kg<br>
    최다 운동 : ${mostExercise}
    `;
}
function resetAllData(){

    let check =
        prompt(
            "정말 모든 기록을 삭제하려면 삭제 라고 입력하세요"
        );

    if(check !== "삭제"){
        alert("초기화 취소");
        return;
    }

    let check2 =
        confirm(
            "진짜 전부 삭제합니다. 복구할 수 없습니다."
        );

    if(!check2){
        return;
    }

    localStorage.removeItem("workouts");
    localStorage.removeItem("goalWeight");
    localStorage.removeItem("todayBodyWeight");

    workouts = [];

    alert("전체 초기화 완료");

    location.reload();

}
function toggleSettings(){

    let panel =

        document.getElementById(
            "settingsPanel"
        );

    if(

        panel.style.display ===
        "block"

    ){

        panel.style.display =
        "none";

    }

    else{

        panel.style.display =
        "block";

    }

}