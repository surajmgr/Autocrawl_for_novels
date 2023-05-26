import React from 'react'
import Entry from '../inputUtils/entry'
import MtlEntry from '../mtlInputUtils/mtlEntry';
import { useLocation } from 'react-router-dom';

function Home() {
  const search = useLocation().search;
  return (
    (search == '?mtl') ?
    <MtlEntry /> :
    <Entry />
  )
}

export default Home