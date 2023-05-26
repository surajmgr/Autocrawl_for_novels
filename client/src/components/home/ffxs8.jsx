import React from 'react'
import Entry from '../inputUtils/entry'
import ShEntry from '../inputUtils/shentry'
import FfEntry from '../inputUtils/ffentry'
import { useLocation } from 'react-router-dom';
import MtlFfEntry from '../mtlInputUtils/mtlFfentry';

function Ffxs8() {
  const search = useLocation().search;
  return (
    (search == '?mtl') ?
    <MtlFfEntry /> :
    <FfEntry />
  )
}

export default Ffxs8