import React from 'react'
import Entry from '../inputUtils/entry'
import ShEntry from '../inputUtils/shentry'
import MtlShEntry from '../mtlInputUtils/mtlShentry';
import { useLocation } from 'react-router-dom';

function Shoudashu() {
  const search = useLocation().search;
  return (
    (search == '?mtl') ?
    <MtlShEntry /> :
    <ShEntry />
  )
}

export default Shoudashu