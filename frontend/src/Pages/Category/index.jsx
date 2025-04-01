import React from "react";
import BreadCrumb from "../../Components/BreadCrumb";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Landingpage/footer";
import CategoryTop from "../../Components/Category/topsection";
import CategoryLayout  from "../../Components/Category/Categorylayout";
export default function CategoryPage ()
{
    return (
<>
<Navbar/>
<BreadCrumb />
<CategoryTop/>
<CategoryLayout/>
<Footer/>
</>
    )
}