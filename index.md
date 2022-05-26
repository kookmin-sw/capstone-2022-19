## ON-감독

### 1.프로젝트 소개

코로나바이러스 감염증(COVID-19)으로 인하여 비대면 활동이 활성화된 현재, 대학에서 진행되는 다양한 평가시험 또한 비대면으로 진행되는 상황이다. 하지만 비대면 시험의 특성상, 개인 혹은 집단의 부정행위를 파악하기란 쉽지 않고, 이에 따른 불만 혹은 불공정성이 제기되고 있다. 따라서 모두가 평등하게 시험을 응시할 수 있도록, 비대면 시험에서 일어날 수 있는 부정행위를 적발하고 그에 맞는 제재를 가할 수 있도록 운영해야 한다. 앞서 말한 문제점을 해결하기 위해, ON 감독 서비스는 Web Real-Time Communication을 가능하게 만들어주는 WebRTC를 이용하여 웹사이트에서 비대면 시험을 치를 수 있는 환경을 제공하고, MediaPipe facemesh model을 이용해 시선정보를 검출하여 부정행위를 적발하는 데 도움을 준다.

### 2.Abstract

Currently, non-face-to-face activities have been activated due to COVID-19, various evaluation tests conducted at universities are also being conducted non-face-to-face. However, due to the nature of non-face-to-face tests, it is not easy to grasp individual or group cheating, and complaints or unfairness are being raised accordingly. Therefore, it should be operated so that everyone can take the test equally and detect possible cheating in non-face-to-face tests and impose appropriate sanctions. To address the aforementioned problems, the ON-gamdok service provides an Web Real-Time Communication environment for non-face-to-face testing on websites using WebRTC, and helps detect cheating using the MediaPipe facemesh model.

### 3.소개영상

1. 시연 영상
<a href="https://youtu.be/R8JPlvt5Rjg">
   <img src="src/public/Original.png" width = "300px" height = "300px">
</a>

### 4.팀 소개

한창희(팀장) <br>
1.Student ID: 20171719 <br>
2.e-mail: sjrnfl0412@kookmin.ac.kr <br>
3.Role: back-end & server <br>

장우석 <br>
1.Student ID: 20171692 <br>
2.e-mail: reverse@kookmin.ac.kr <br>
3.Role: algorithm <br>

최근표 <br>
1.Student ID: 20171710 <br>
2.e-mail: ckp220@kookmin.ac.kr <br>
3.Role: front-end & ui <br>



### 5.사용법

-local 환경에서 테스트
```markdown
$ git clone https://github.com/kookmin-sw/capstone-2022-19.git
$ cd capstone-2022-19
$ npm install
$ npm start
```
-heroku 환경에서 테스트
```markdown
$ heroku login
$ heroku create <YOUR-APP-NAME>
$ git clone https://github.com/kookmin-sw/capstone-2022-19.git
$ cd capstone-2022-19
$ heroku git:remote -a <YOUR-APP-NAME>
$ git push heroku master
```
-수정 및 재배포
```markdown
$ git add .
$ git commit -m "commit message" 
$ git push heroku master
```

### 6.시스템 구조

<img src="src/public/archi.PNG">

