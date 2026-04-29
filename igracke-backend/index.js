require('dotenv').config();
const express = require('express');
const cors = require('cors');
const neo4j = require('neo4j-driver');

const app = express();
app.use(cors());
app.use(express.json());


const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

// Test 
driver.verifyConnectivity()
  .then(() => console.log(' Neo4j konekcija uspešna!'))
  .catch(err => console.error(' Neo4j greška:', err));



// Kupovina
app.post('/api/kupovina', async (req, res) => {
  const { korisnikEmail, korisnikIme, igrackaId, igrackaName, kolicina, ukupno, status } = req.body;
  const session = driver.session();
  try {
    await session.run(
      `MERGE (k:Korisnik {email: $korisnikEmail})
       SET k.ime = $korisnikIme
       MERGE (i:Igracka {toyId: $igrackaId})
       SET i.name = $igrackaName
       CREATE (k)-[:KUPIO {
         kolicina: $kolicina,
         ukupno: $ukupno,
         status: $status,
         datum: $datum
       }]->(i)`,
      {
        korisnikEmail,
        korisnikIme,
        igrackaId: neo4j.int(igrackaId),
        igrackaName,
        kolicina: neo4j.int(kolicina),
        ukupno: neo4j.int(ukupno),
        status,
        datum: new Date().toLocaleDateString('sr-RS')
      }
    );
    res.json({ uspeh: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ greska: err.message });
  } finally {
    await session.close();
  }
});

// Vrati kpovine
app.get('/api/kupovine', async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (k:Korisnik)-[r:KUPIO]->(i:Igracka)
       RETURN k.ime as ime, k.email as email,
              i.name as igracka, i.toyId as toyId,
              r.kolicina as kolicina, r.ukupno as ukupno,
              r.status as status, r.datum as datum
       ORDER BY r.datum DESC`
    );
    const kupovine = result.records.map(r => ({
      ime: r.get('ime'),
      email: r.get('email'),
      igracka: r.get('igracka'),
      toyId: r.get('toyId'),
      kolicina: r.get('kolicina'),
      ukupno: r.get('ukupno'),
      status: r.get('status'),
      datum: r.get('datum')
    }));
    res.json(kupovine);
  } catch (err) {
    res.status(500).json({ greska: err.message });
  } finally {
    await session.close();
  }
});

// Dobij kupovine jednog korisnika
app.get('/api/kupovine/:email', async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (k:Korisnik {email: $email})-[r:KUPIO]->(i:Igracka)
       RETURN i.name as igracka, i.toyId as toyId,
              r.kolicina as kolicina, r.ukupno as ukupno,
              r.status as status, r.datum as datum
       ORDER BY r.datum DESC`,
      { email: req.params.email }
    );
    const kupovine = result.records.map(r => ({
      igracka: r.get('igracka'),
      toyId: r.get('toyId'),
      kolicina: r.get('kolicina'),
      ukupno: r.get('ukupno'),
      status: r.get('status'),
      datum: r.get('datum')
    }));
    res.json(kupovine);
  } catch (err) {
    res.status(500).json({ greska: err.message });
  } finally {
    await session.close();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server pokrenut na http://localhost:${PORT}`);
});