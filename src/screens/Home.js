import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Carousal from '../components/Carousal'
import Cards from '../components/Cards'

export default function Home() {


    const [search, setSearch] = useState('')
    const [foodCat, setFoodCat] = useState([])
    const [foodItem, setFoodItem] = useState([])

    const loadData = async () => {
        let response = await fetch("http://localhost:5000/api/foodData", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        })
        response = await response.json();
        // console.log(response)

        setFoodItem(response[0]);
        setFoodCat(response[1]);

        // console.log(response[0], response[1]);
    }

    useEffect(() => {
        loadData()
    }, [])

    return (
        <div>
            <div> <Navbar /></div>
            <div>
                <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner" id='carousel'>
                        <div className="carousel-item active">
                            <img src="https://source.unsplash.com/random/900x700/?burger" className="d-block w-100" alt="Burger" style={{ filter: "brightness(30%)" }} />
                            <div className="carousel-caption" style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '60%', textAlign: 'center' }}>
                                <div className="d-flex justify-content-center" role="search">
                                    <input className="form-control me-1" type="search" placeholder="Search" aria-label="Search" value={search} onChange={(e) => { setSearch(e.target.value) }} style={{ width: '100%' }} />
                                </div>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img src="https://source.unsplash.com/random/900x700/?pizza" className="d-block w-100" alt="Pizza" style={{ filter: "brightness(30%)" }} />
                            <div className="carousel-caption" style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '60%', textAlign: 'center' }}>
                                <div className="d-flex justify-content-center" role="search">
                                    <input className="form-control me-1" type="search" placeholder="Search" aria-label="Search" value={search} onChange={(e) => { setSearch(e.target.value) }} style={{ width: '100%' }} />
                                </div>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img src="https://source.unsplash.com/random/900x700/?barbeque" className="d-block w-100" alt="Barbeque" style={{ filter: "brightness(30%)" }} />
                            <div className="carousel-caption" style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '60%', textAlign: 'center' }}>
                                <div className="d-flex justify-content-center" role="search">
                                    <input className="form-control me-1" type="search" placeholder="Search" aria-label="Search" value={search} onChange={(e) => { setSearch(e.target.value) }} style={{ width: '100%' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>

            <div className='container'>
                {
                    foodCat && foodCat.length !== 0 ? foodCat.map((data) => {
                        return (<div className='row mb-3'>
                            <div key={data._id} className='fs-3 m-3'> {/* Assuming each data object has a unique id */}
                                {data.CategoryName}
                            </div>
                            <hr />
                            {foodItem && foodItem.length !== 0 ?
                                foodItem.filter((item) => item.CategoryName === data.CategoryName && item.name.toLowerCase().includes(search.toLowerCase()))
                                    .map(filterItems => {
                                        return (
                                            <div key={filterItems._id} className='col-12 col-md-6 col-lg-3'>
                                                <Cards foodItem={filterItems}
                                                    options={filterItems.options[0]}>
                                                </Cards>
                                            </div>
                                        )
                                    }

                                    ) : <div>No such data found !</div>}
                        </div>
                        )
                    }) : "No data available"
                }
            </div>
            <div><Footer /></div>
        </div >

    )
}
