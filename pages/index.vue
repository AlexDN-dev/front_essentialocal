<template>
  <div class="index">
    <section class="landing">
      <div class="text">
        <article>
          <h2>Manger plus local avec <span>Essentialocal</span></h2>
          <p>Cultivons ensemble une alimentation responsable.</p>
        </article>
        <div style="width: 100%; display: flex; justify-content: start">
          <NuxtLink
            to="#"
            style="
              text-decoration: none;
              margin-right: 10px;
              text-align: center;
            "
          >
            <div class="searchButton">
              <p>Rechercher un produit</p>
            </div>
          </NuxtLink>
          <NuxtLink to="#" style="text-decoration: none; text-align: center">
            <div class="searchFarmButton">
              <p>Les fermes</p>
            </div>
          </NuxtLink>
        </div>
      </div>
      <div class="landingImg">
        <img src="/public/landing/landingV4.png" alt="" />
      </div>
    </section>
    <section class="aboutUs">
      <div class="title">
        <h2>Qui nous sommes ?</h2>
      </div>
      <div class="desc">
        <p>
          Chez Essentialocal, nous sommes dédiés à la promotion de l'agriculture
          locale et à la mise en relation directe des fermiers avec les
          consommateurs.
        </p>
        <span
          >Notre mission est de soutenir les agriculteurs en leur offrant une
          plateforme facile d'utilisation pour vendre leurs produits directement
          aux consommateurs, sans intermédiaires. Nous croyons fermement en la
          qualité des produits locaux et en l'importance de consommer de manière
          responsable et durable.</span
        >
        <NuxtLink to="#" class="moreInfo">
          <p>En savoir plus</p>
        </NuxtLink>
      </div>
    </section>
    <section class="divider"></section>
    <section class="whyUs">
      <h2 style="font-size: 36px; margin: 60px 0">
        Pourquoi choisir Essentialocal ?
      </h2>
      <div class="whyUsContainer">
        <div class="card">
          <img src="/public/landing/why_images/1.png" alt="" />
          <div>
            <p>Soutien aux producteur locaux</p>
            <span
              >Permet aux fermiers de vendre directement leurs produits,
              augmentant ainsi leurs revenus et la visibilité de leur
              travail.</span
            >
          </div>
          <img class="arrow1" src="/public/landing/arrow_1.png" alt="" />
        </div>
        <div class="card reversed">
          <div>
            <p>Promotion de la durabilité</p>
            <span
              >Favorise les circuits courts et les pratiques agricoles
              respectueuses de l'environnement, réduisant ainsi l'empreinte
              carbone.</span
            >
          </div>
          <img src="/public/landing/why_images/2.png" alt="" />
          <img class="arrow2" src="/public/landing/arrow_2.png" alt="" />
        </div>
        <div class="card">
          <img src="/public/landing/why_images/3.png" alt="" />
          <div>
            <p>Expérience utilisateur simplifiée</p>
            <span
              >Offre une plateforme intuitive et facile à utiliser pour les
              fermes et les consommateurs, rendant le processus d'achat et de
              vente fuide et efficace.</span
            >
          </div>
        </div>
      </div>
    </section>
    <section class="faq">
      <h2>FAQs</h2>
      <el-collapse accordion>
        <el-collapse-item
          title="Quels types de produits sont vendus sur Essentialocal ?"
          name="1"
        >
          <div>
            Consistent with real life: in line with the process and logic of
            real life, and comply with languages and habits that the users are
            used to;
          </div>
          <div>
            Consistent within interface: all elements should be consistent, such
            as: design style, icons and texts, position of elements, etc.
          </div>
        </el-collapse-item>
        <el-collapse-item
          title="Comment ajouter ma ferme et mes produits sur la plateforme ?"
          name="2"
        >
          <div>
            Operation feedback: enable the users to clearly perceive their
            operations by style updates and interactive effects;
          </div>
          <div>
            Visual feedback: reflect current state by updating or rearranging
            elements of the page.
          </div>
        </el-collapse-item>
        <el-collapse-item
          title="Quels sont les modes de livraisons disponibles ?"
          name="3"
        >
          <div>
            Simplify the process: keep operating process simple and intuitive;
          </div>
          <div>
            Definite and clear: enunciate your intentions clearly so that the
            users can quickly understand and make decisions;
          </div>
          <div>
            Easy to identify: the interface should be straightforward, which
            helps the users to identify and frees them from memorizing and
            recalling.
          </div>
        </el-collapse-item>
        <el-collapse-item
          title="Comment contacter le support en cas de problème ?"
          name="4"
        >
          <div>
            Decision making: giving advices about operations is acceptable, but
            do not make decisions for the users;
          </div>
          <div>
            Controlled consequences: users should be granted the freedom to
            operate, including canceling, aborting or terminating current
            operation.
          </div>
        </el-collapse-item>
      </el-collapse>
    </section>
    <section class="addFarm">
      <h2>
        Prêt à rejoindre l'aventure ?
        <img src="/public/landing/heart1.png" alt="" />
      </h2>
      <p>
        Alors n'hésitez plus ! Faites la demande en cliquant sur le bouton et en
        remplissant les informations relatives à votre ferme. Dès que la demande
        sera acceptée vous pouvez commencer à ajouter vos produits et vous faire
        connaitre de tout le monde.
        <img src="/public/landing/heart2.png" alt="" />
      </p>
      <AddFarm />
    </section>
  </div>
</template>

<style scoped>
.index {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.landing {
  padding: 20px;
  border-radius: 40px;
  width: 95%;
  background-image: url("/public/landing/bg.png");
  background-size: cover;
  background-position: center;
  height: 80vh;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  position: relative; /* Assurez-vous que la div parent est positionnée */
  z-index: 0; /* Définir le z-index de la div parent si nécessaire */
}
.landing .text {
  flex-direction: column;
  align-items: start;
  justify-content: space-between;
  width: 55%;
  height: 70%;
  margin-left: 50px;
}
.landing .text span {
  position: relative;
  z-index: 1; /* Assurez-vous que le texte est au-dessus de l'élément ::after */
}

.landing .text span::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 30px;
  z-index: -1; /* Assurez-vous que le pseudo-élément est derrière le texte mais devant le fond */
  background-color: #1fa254;
  left: 0;
  bottom: 5px;
}
.landing .text h2 {
  font-size: 54px;
  width: 75%;
  margin: 20px 0;
  font-weight: 600;
}
.landing .text p {
  font-size: 20px;
  font-weight: 300;
}
.landing div {
  width: 45%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.landing img {
  width: 70%;
  min-width: 400px;
  height: 100%;
}
.landing .searchButton {
  cursor: pointer;
  background-color: #1fa254;
  color: white;
  padding: 10px 20px;
  border-radius: 30px;
  border: none;
  position: relative;
  width: auto;
  overflow: hidden;
}
.landing .searchFarmButton {
  cursor: pointer;
  background-color: #fff9f6;
  color: #1fa254;
  padding: 10px 20px;
  border-radius: 30px;
  border: 1px solid #1fa254;
  position: relative;
  width: auto;
  overflow: hidden;
}
.searchButton p {
  font-size: 20px;
  font-weight: 500;
}

.landing .searchButton::after {
  content: "";
  left: -50px;
  display: block;
  width: 20px;
  height: 200px;
  position: absolute;
  background-color: rgba(255, 255, 255, 0.7);
  transition: 0.7s;
  transform: rotateZ(-30deg);
}
.searchButton:hover::after {
  left: 110%;
}
.aboutUs {
  width: 85%;
  height: 70vh;
  display: flex;
  align-items: center;
}
.aboutUs .title {
  width: 50%;
  height: 60%;
}
.title h2 {
  font-size: 36px;
  position: relative;
  width: fit-content;
}
.aboutUs p {
  font-size: 24px;
  font-weight: 500;
}
.aboutUs span {
  font-size: 20px;
  font-weight: 300;
}
.aboutUs .title img {
  width: 80px;
  height: 80px;
  position: absolute;
  right: -85px;
  top: -25px;
}
.aboutUs .desc {
  width: 50%;
  height: 60%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: start;
}
.aboutUs .moreInfo {
  text-decoration: none;
  color: #1fa254;
  position: relative;
  overflow: hidden;
}
.aboutUs .moreInfo p:hover::after {
  transition: 0.5s;
  transform: translateX(200px) translateY(-200px) rotateZ(45deg);
}
.aboutUs .moreInfo p:hover {
  color: white;
}
.aboutUs .moreInfo p::after {
  content: "";
  position: absolute;
  background-color: #1fa254;
  width: 300px;
  height: 300px;
  left: -250px;
  transform: rotateZ(45deg);
  transition: 0.5s;
  z-index: -1;
}
.aboutUs .moreInfo p {
  font-size: 20px;
  font-weight: 400;
  border: 1px solid #1fa254;
  padding: 8px 25px;
  border-radius: 25px;
  position: relative;
  overflow: hidden;
  z-index: 999;
  transition: 0.5s;
}
.divider {
  width: 100%;
  height: 5px;
  background-color: lightgray;
}
.whyUs {
  display: flex;
  flex-direction: column;
  width: 80%;
  text-align: center;
}
.whyUs .card {
  background-image: url("/public/landing/bg.png");
  background-position: center;
  background-size: cover;
  border-radius: 40px;
  display: flex;
  text-align: start;
  justify-content: space-evenly;
  padding: 45px 0;
  position: relative;
}
.whyUs .reversed {
  background-image: url("/public/landing/bg_reversed.png");
  margin: 50px 0;
  position: relative;
}
.whyUs .card .arrow1 {
  position: absolute;
  bottom: -175px;
  left: 45%;
  z-index: 999;
}
.whyUs .arrow2 {
  width: 300px;
  height: 300px;
  position: absolute;
  bottom: -175px;
  left: 45%;
  z-index: 999;
}
.whyUs .card div {
  width: 50%;
}
.whyUs .card img {
  width: 300px;
  height: 300px;
}
.whyUs .card p {
  font-size: 32px;
  font-weight: 500;
  margin-bottom: 50px;
}
.whyUs .card span {
  font-size: 24px;
}
.faq {
  width: 80%;
  display: flex;
  justify-content: space-between;
  height: 50vh;
  margin-top: 75px;
}
.el-collapse {
  width: 60%;
}
.el-collapse-item__header {
  font-size: 24px;
}
.addFarm {
  width: 80%;
  background-color: #fff9f6;
  margin: 50px 0;
  height: 45vh;
  text-align: center;
  border-radius: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.addFarm h2 {
  font-size: 36px;
  font-weight: 500;
  margin: 25px 0;
  position: relative;
}
.addFarm h2 img {
  position: absolute;
  top: -100px;
  left: -125px;
  width: 125px;
}
.addFarm p {
  font-size: 24px;
  font-weight: 400;
  margin-bottom: 40px;
  width: 80%;
  position: relative;
}
.addFarm p img {
  position: absolute;
  top: 100%;
  right: 125px;
  width: 80px;
}
@media (max-width: 1095px) {
  .addFarm p img {
    right: -50px;
  }
}
@media (max-width: 947px) {
  .landing {
    justify-content: center;
  }
  .landing .text {
    align-items: center;
    justify-content: center;
    margin-left: 0;
    width: 100%;
  }
  .text article {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
  .landing .text h2 {
    width: 100%;
    font-size: 48px;
  }
  .landing div {
    display: flex;
    justify-content: center !important;
  }
  .landing .landingImg {
    display: none;
  }
  .aboutUs {
    flex-direction: column;
  }
  .aboutUs .title {
    height: fit-content;
    margin: 10px 0;
    text-align: center;
    width: fit-content;
  }
  .aboutUs .desc {
    width: 100%;
    align-items: center;
    height: 100%;
    justify-content: space-around;
  }
  .aboutUs p {
    text-align: center;
  }
  .aboutUs span {
    text-align: center;
  }
  .aboutUs .title h2 img {
    display: none;
  }
  .whyUs .card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .whyUs .card img {
    margin-bottom: 10px;
  }
  .whyUs .arrow2 {
    display: none;
  }
  .whyUs .arrow1 {
    display: none;
  }
  .reversed img {
    order: -1;
  }
  .faq {
    flex-direction: column;
    justify-content: start;
    align-items: center;
  }
  .faq h2 {
    margin-bottom: 20px;
  }
  .el-collapse {
    width: 100%;
    height: 500px;
  }
  .addFarm h2 img {
    width: 75px;
    top: -25px;
    left: -80px;
  }
  .addFarm h2 {
    font-size: 28px;
  }
  .addFarm p {
    font-size: 20px;
  }
}
@media (max-width: 548px) {
  .faq {
    display: none;
  }
  .aboutUs p {
    font-size: 20px;
  }
  .aboutUs span {
    font-size: 18px;
  }
  .addFarm h2 img {
    display: none;
  }
  .addFarm p img {
    display: none;
  }
  .addFarm h2 {
    font-size: 24px;
  }
  .addFarm p {
    font-size: 18px;
  }
}
</style>
