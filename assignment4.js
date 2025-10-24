body {
  font-family: Arial, sans-serif;
  text-align: center;
  margin: 0;
  padding: 0;
  background-color: #f9fafb;
  color: #1e293b;
}

h1, h2 {
  color: yellow;
  margin-top: 0;
}

h1 {
  font-family: Chalkduster, fantasy;
  font-size: 3em;
}

header {
  background-image: url(headerBackground.png);
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
}

header ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

header ul li {
  font-size: 1em;
  color: yellow;
  margin: 3px 0;
}

main {
  margin: 20px auto;
  width: 95%;
  max-width: 500px;
}

#gameWrapper {
  border: 2px solid black;
  background-image: url('backgroundDay.png');
  background-size: cover;
  background-position: center;
  transition: background-image 0.5s ease-in-out;
  width: 100%;
  height: 400px;
  display: block;
  margin: 0 auto;
}

#gameArea {
  width: 100%;
  height: 100%;
}

button {
  margin: 10px;
  padding: 10px 18px;
  font-size: 1em;
  background-color: #1e3a8a;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #3b82f6;
}

#scoreBoard {
  font-size: 1.4em;
  margin-top: 10px;
  font-weight: bold;
}

footer {
  background-image: url(footerBackground.png);
  background-size: cover;
  background-position: center;
  height: 60px;
  margin-top: 20px;
}

footer p {
  color: #004aad;
  font-size: 1em;
  font-weight: bold;
  line-height: 60px;
}
