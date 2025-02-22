'use client';
import React, { useState, useEffect } from 'react'
import Navbar from '../components/common/Navbar'
import Link from 'next/link'
import { useSelector } from "react-redux";
import Footer from '../components/common/Footer';

export default function About() { 

  return (
    <div>
        <Navbar/>
        <p>About us page</p>
        <Link href="/">
            <p>Back to Home page</p>
        </Link>
        <Footer/>
    </div>
  )
}
