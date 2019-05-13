<h1 align="center">
Hypertube 
</h1>

<h3 align="center"><b>Description</b></h3>
<p>Dernier projet de sa série, le projet Hypertube vous invite à découvrir une catégorie d'outil extrêmement puissante : les frameworks MVC. Vous apprendrez à manipuler un MVC, dans le langage de votre choix, pour réaliser un site de streaming de video téléchargées via le protocole BitTorrent.</p>

<p><b>Objectif :</b> Créer un site de streaming.</p>
<p><b>Langage :</b> Javascript.</p>
<p><b>Base de données :</b> MongoDB.</p>
<p><b>[Micro]Framework :</b> NodeJs Express.</p>
<p><b>Template :</b></p>
<p><b>Libraries principales:</b> Bootstrap.</p>

<h3 align="center"><b>Fonctionalité</b></h3>
<ul><b>Compte utilisateur</b>
<li> Creation de compte sur le site </li>
<li> Connection via OmniAuth </li>
<li> Possibilitée de commenter des films </li></ul>
<ul><b>Film</b>
<li> Suggestion de film </li>
<li> Recherche et tri avec differents critères </li>
<li> Sous-titres (fr ou en) si disponible </li></ul>

<ul><h3 align="center">Lancer le site</h3>
<li><code>git clone https://github.com/Drakauf/Hypertube.git</code></li>
<li><code>cd Hypertube</code></li>
<li>mettre les identifiants des differents OmniAuth (Google, GitHub, 42) dans <b>back/src/util/</b> et mail dans <b>back/src/route/router_user.js</b> </li>
<li><code>docker-compose up</code></li>
<li>naviguer sur <b>localhost:4200</b> profiter pleinement du site</li></ul>
</br>

||<h3 align="center"> Documentation </h3>|
|:--------:|:---------:|
|Angular|https://angular.io|
|Videogular|http://www.videogular.com/|
|Yts|https://yts.am/api|
|Authentification avec un token|https://auth0.com/blog/angular-2-authentication/ http://jasonwatmore.com/post/2018/11/16/angular-7-jwt-authentication-example-tutorial#login-component-ts|
|RxJs|https://makina-corpus.com/blog/metier/2017/premiers-pas-avec-rxjs-dans-angular|
----
<p align="right">
Credits </br><a href="https://github.com/modeler3310">guibayle</a> <a href="https://github.com/serronia">jdarko</a>  <a href="https://github.com/kerbault">kerbault</a>  <a href="https://github.com/Otterqueen">mchapard</a>  <a href="https://github.com/Drakauf">shthevak</a>

