
let city=document.querySelector('.weather_city');
let day=document.querySelector('.weather_day');
let humidity=document.querySelector('.humidity>.value');
let wind =document.querySelector('.wind>.value');
let pressure=document.querySelector('.pressure>.value');
let image=document.querySelector('.weathr_image');
let temperature=document.querySelector('.weather_temperature>.value');
let searchInput=document.querySelector('.weather_search');

let weatherAPIKey='c5ca41c7e94f8c6e10e93d9b6b78c983'
let weatherBaseEndpoint='https://api.openweathermap.org/data/2.5/weather?units=metric&appid='+weatherAPIKey;
let getWeatherByCityName=async (city)=>{
    let endpoint =weatherBaseEndpoint+'&q='+city;
    let response=await fetch(endpoint);
    let weather=await response.json();
    console.log(weather);
    return weather;
}

searchInput.addEventListener('keydown',async(e)=>{
    if(e.keyCode==13){
        let weather=await getWeatherByCityName(searchInput.value);
        updateCurrenWeather(weather)
    }
})
function updateCurrenWeather(data){
    city.textContent=data.name+','+data.sys.country;
    temperature.textContent=data.main[0]
    day.textContent=new Date().toLocaleDateString('en-EN',{'weekday':'long'})
    humidity.textContent=data.main.humidity;
    pressure.textContent=data.main.pressure;
    console.log(pressure.innerContent);
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
}