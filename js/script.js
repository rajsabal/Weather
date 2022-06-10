
let city=document.querySelector('.weather_city');
let day=document.querySelector('.weather_day');
let humidity=document.querySelector('.humidity>.value');
let wind =document.querySelector('.wind>.value');
let pressure=document.querySelector('.pressure>.value');
let image=document.querySelector('.weather_image');
let temperature=document.querySelector('.weather_temperature>.value');
let searchInput=document.querySelector('.weather_search');
let forecastBlock=document.querySelector('.weather_forecast')
let weatherAPIKey='c5ca41c7e94f8c6e10e93d9b6b78c983'
let weatherBaseEndpoint='https://api.openweathermap.org/data/2.5/weather?units=metric&appid='+weatherAPIKey;
let forecastBaseEndpoint='https://api.openweathermap.org/data/2.5/forecast?units=metric&appid='+weatherAPIKey;
let cityBaseEndpoint=' https://api.teleport.org/api/cities/?search= '
let suggestions=document.querySelector('#suggestions')
let weatherImages = [
    {
        url: 'images/clear-sky.png',
        ids: [800]
    },
    {
        url: 'images/broken-clouds.png',
        ids: [803, 804]
    },
    {
        url: 'images/few-clouds.png',
        ids: [801]
    },
    {
        url: 'images/mist.png',
        ids: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781]
    },
    {
        url: 'images/rain.png',
        ids: [500, 501, 502, 503, 504]
    },
    {
        url: 'images/scattered-clouds.png',
        ids: [802]
    },
    {
        url: 'images/shower-rain.png',
        ids: [520, 521, 522, 531, 300, 301, 302, 310, 311, 312, 313, 314, 321]
    },
    {
        url: 'images/snow.png',
        ids: [511, 600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622]
    },
    {
        url: 'images/thnderstorm.png',
        ids: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232]
    }
]

let getWeatherByCityName=async (city)=>{
    let endpoint =weatherBaseEndpoint+'&q='+city;
    let response=await fetch(endpoint);
    let weather=await response.json();
    // console.log(weather);
    return weather;
}

let getForecastByCityName=async (city)=>{
    let endpoint =forecastBaseEndpoint+'&q='+city;
    let response=await fetch(endpoint);
    let forecast=await response.json();
    // console.log(forecast);
    return forecast;
}

searchInput.addEventListener('keydown',async(e)=>{
    if(e.keyCode==13){
    
        let weather=await getWeatherByCityName(searchInput.value);
        let forecast=await getForecastByCityName(searchInput.value)
        updateCurrenWeather(weather);
        updateForecast(forecast.list);
        // console.log(forecast.list);
        // forecast.forEach(day=>{
        //     console.log('n');
        // })
    }
})
function updateCurrenWeather(data){
  
    city.textContent=data.name+','+data.sys.country;
    temperature.textContent=data.main[0]
    day.textContent=new Date().toLocaleDateString('en-EN',{'weekday':'long'})
    humidity.textContent=data.main.humidity;
    pressure.textContent=data.main.pressure;
   
    let deg=data.wind.deg;
    let windDirection;
    if(deg>45&&deg<=135){
        windDirection='East';
    }
    else if(deg>135&&deg<=225){
        windDirection='South';
    }
    else if(deg>225&&deg<=315){
        windDirection='West';
    }
    else{
        windDirection="North"
    }
    wind.textContent=windDirection+', '+data.wind.speed;
    temperature.textContent=data.main>0?'+'+Math.round(data.main.temp):Math.round(data.main.temp);
    let imgID=data.weather[0].id;
    weatherImages.forEach(e=>{
        if(e.ids.includes(imgID)){
            image.src=e.url;
        }
    })
}
let minTemp=[];
let maxTemp=[];
function updateForecast(data){
    forecastBlock.innerHTML='';
    let count=0;
    let daily=[];
 
    data.forEach(day=>{
        
        if(count%8==0){
            maxTemp.push(Math.floor(day.main.temp_max))
        }
        if(count%8==4){
            minTemp.push(Math.floor(day.main.temp_min))
        }
        if(count%8==0)
        daily.push(day)
        count++;
    })
    // console.log(daily);
    let i=0;
    daily.forEach(day=>{
      let iUrl = 'http://openweathermap.org/img/wn/'+day.weather[0].icon+'@2x.png';  
      let Day=dayofWeek(day.dt*1000);
        
let forecatItem=`
            <article class="weather_forecast_item">
            <img src="${iUrl}"alt="$[day.weather[0].description}" class="weather_forecast_icon">
            <h3 class="weather_forecast_day">${Day}</h3>
            <p class="max_temp"><span class="value">${maxTemp[i]}</span>&deg C</p>
            <p class="min_temp"><span class="value">${minTemp[i]}</span>&deg C</p>
            </article>    
    `
      forecastBlock.insertAdjacentHTML('beforeend',forecatItem)
      i++;
    })
}
searchInput.addEventListener('input',async ()=>{
    let endpoint=cityBaseEndpoint+searchInput.value;
    let result=await(await fetch(endpoint)).json();
    console.log(result);
    suggestions.innerHTML='';
    let cities=result._embedded['city:search-results'];
    let length =cities.length>5?5:cities.length;
    for(let i=0;i<length;i++){
        let option=document.createElement('option');
        option.value=cities[i].matching_full_name;
        suggestions.appendChild(option)
    }
})
function dayofWeek (dt=new Date().getTime()){
    return new Date(dt).toLocaleDateString('en-En',{'weekday':'long'})
}


window.onload = async()=>{ 
    let weather=await getWeatherByCityName('jaipur');
    let forecast=await getForecastByCityName('jaipur')
    updateCurrenWeather(weather);
    updateForecast(forecast.list);
    document.body.style.filter = 'blur(0)';
}
