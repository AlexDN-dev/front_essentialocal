<script setup></script>

<template>
  <div>
    <LandingV2 />
    <div class="divider"></div>
    <section class="thirdSection">
      <div>
        <h2>
          Vous possèdez une ferme et vous voulez rejoindre Essentialocal ?
        </h2>
        <p>
          Alors n'hésitez plus ! Faites la demande en cliquant sur le bouton et
          en remplissant les informations relatives à votre ferme. Dès que la
          demande sera acceptée vous pouvez commencer à ajouter vos produits et
          vous faire connaitre de tout le monde.
        </p>
        <AddFarm />
      </div>
    </section>
  </div>
</template>

<style scoped>
.divider {
  width: 100%;
  height: 25px;
  background-color: #1fa254;
  background: linear-gradient(90deg, #1fa254 0%, #196f3d 100%);
}
.firstSection {
  width: 100%;
}
.firstSection h2 {
  text-align: center;
  font-size: 36px;
  font-weight: 500;
  margin: 30px 0;
}
.category {
  width: 100%;
  height: 250px;
  display: flex;
}
.category div {
  width: 25%;
  height: 250px;
  transition: 0.5s;
  display: flex;
  justify-content: center;
  align-items: center;
  filter: blur(3px);
}
.category div p {
  font-size: 36px;
  color: rgb(0, 0, 0);
  font-weight: 500;
  opacity: 0;
  background-color: white;
  padding: 3px;
  border-radius: 8px;
}
.category div:hover {
  transition: 0.5s;
  width: 35%;
  filter: blur(0);
}
.category div:hover p {
  opacity: 1;
}
.firstSection .fruit {
  background-image: url("/public/pictures/fruit.png");
  background-position: center;
  background-size: cover;
}
.firstSection .legume {
  background-image: url("/public/pictures/legume.png");
  background-position: center;
  background-size: cover;
}
.firstSection .viande {
  background-image: url("/public/pictures/viande.png");
  background-position: center;
  background-size: cover;
}
.firstSection .lait {
  background-image: url("/public/pictures/lait.png");
  background-position: center;
  background-size: cover;
}
.thirdSection {
  display: flex;
  justify-content: center;
  margin: 100px 0;
}
.thirdSection div {
  width: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.thirdSection h2 {
  font-weight: 500;
  font-size: 32px;
}
.thirdSection p {
  margin: 20px 0;
  font-size: 20px;
}
</style>
