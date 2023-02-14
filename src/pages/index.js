import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'


async function registerClient() {
  const res = await fetch('https://esilv.olfsoftware.fr/td5/register', {
    method: 'GET',
  })
  const data = await res.json()
  console.log(data)
  return data
}





export default function Home() {
  const [id, setId] = useState("");
  const [list, setList] = useState([]);
  const [seq, setSeq] = useState(0);

  useEffect(() => {
    registerClient().then((data) => {
      setList(data.courses);
      setId(data.id);
      setSeq(data.sequence);
    }).catch((err) =>{
      const localList = JSON.parse(window.localStorage.getItem('list'));
      setList(localList);
    });
  }, []);

  useEffect(() => { 
    if(list.length>0)
      window.localStorage.setItem('list', JSON.stringify(list));
  }, [list]);

  async function fetchList() {
    const params = new URLSearchParams({id , seq });
    const res = await fetch('https://esilv.olfsoftware.fr/td5/courses?' + params.toString(), {
      method: 'GET',
    })
    const data = await res.json()
    console.log("changes",data)
    return data
  }

  async function returnList(objets) {

    const params = new URLSearchParams({
      id,
      chg: JSON.stringify([objets]),
    });
    console.log(JSON.stringify([objets]))
    const res = await fetch('https://esilv.olfsoftware.fr/td5/courses', {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:params.toString(),  
  })
  console.log(res);
  }

  async function handleSubmit(e){
    e.preventDefault();
    const produit = e.target[0].value;
    const qte = e.target[1].value;
    const newList = [...list];
    const objet = {produit, qte};
    newList.push(objet);
    await returnList(objet);
/*     setTimeout(() => fetchList().then((data) => {
      const newList = list.concat(data.chg);
      setList(newList);
      setId(data.id);
      setSeq(data.sequence);
    }), 10000); */

    setList(newList.sort((a,b)=>a.produit.localeCompare(b.produit)));
  }

  return (
    <>
      <h1>Ma liste de courses</h1>
      <form onSubmit= {handleSubmit}>
        <input type="text" placeholder="Produit"/>
        <input type="number" placeholder="Quantité"/>
        <button type="submit">Ajouter</button>
      </form>
      <ul>
        {list.map((objet,index)=>{
          return <li key={index}>{objet.produit} {objet.qte}</li>
        })}
        </ul>
     
    </>
  )
}
