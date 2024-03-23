import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Carousal from '../components/Carousal';
import Cards from '../components/Cards';

export default function Home() {
    const [search, setSearch] = useState('');
    const [foodCat, setFoodCat] = useState([]);
    const [foodItem, setFoodItem] = useState([]);
    const [showCarousel, setShowCarousel] = useState(true); // State to toggle carousel visibility

    const loadData = async () => {
        let response = await fetch("http://localhost:5000/api/foodData", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        response = await response.json();
        setFoodItem(response[0]);
        setFoodCat(response[1]);
    };

    const handleBuyNow = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        // Toggle carousel visibility based on search query
        setShowCarousel(e.target.value === '');
    };

    return (
        <div>
            <Navbar search={search} setSearch={setSearch} setShowCarousel={setShowCarousel} />
            <div style={{ position: 'relative' }}>
                {showCarousel && (
                    <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel" style={{ zIndex: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 400, width: '100%', height: '100%', zIndex: 1 }}>
                    <div className="card" style={{ width: '31.5rem' }}>
                        <img src="https://cdn.grabon.in/gograbon/images/web-images/uploads/1618575517942/food-coupons.jpg" className="card-img-top" alt="Offer 1" style={{ width: '500px', height: '500px', margin: 'auto' }} />
                        <div className="card-body">
                            <button className="btn btn-dark" onClick={handleBuyNow}>Buy Now</button>
                        </div>
                    </div>
                </div>
                        <div className="carousel-inner" id='carousel'>
                            <div className="carousel-item active">
                                <img src="https://source.unsplash.com/random/900x700/?burger" className="d-block w-100" alt="Burger" style={{ filter: "brightness(30%)" }} />
                            </div>
                            <div className="carousel-item">
                                <img src="https://source.unsplash.com/random/900x700/?pizza" className="d-block w-100" alt="Pizza" style={{ filter: "brightness(30%)" }} />
                            </div>
                            <div className="carousel-item">
                                <img src="https://source.unsplash.com/random/900x700/?barbeque" className="d-block w-100" alt="Barbeque" style={{ filter: "brightness(30%)" }} />
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
                )}
            </div>

            {/* Rest of the content */}
            <div className='container'>
                <div className="row mb-3">
                    {search && search.trim() !== '' ? (
                        foodItem.filter(item => item.name.toLowerCase().includes(search.toLowerCase())).map(filteredItem => (
                            <div key={filteredItem._id} className='col-12 col-md-6 col-lg-3'>
                                <Cards foodItem={filteredItem} options={filteredItem.options[0]} />
                            </div>
                        ))
                    ) : (
                        foodCat && foodCat.length !== 0 ? foodCat.map((data) => (
                            <>
                                <div key={data._id} className='fs-3 m-3'>
                                    {data.CategoryName}
                                </div>
                                <hr />
                                {foodItem && foodItem.length !== 0 ?
                                    foodItem.filter((item) => item.CategoryName === data.CategoryName).map(filterItems => (
                                        <div key={filterItems._id} className='col-12 col-md-6 col-lg-3'>
                                            <Cards foodItem={filterItems} options={filterItems.options[0]} />
                                        </div>
                                    )) : <div>No such data found !</div>}
                            </>
                        )) : "No data available"
                    )}
                </div>
            </div>
            <div><Footer /></div>
        </div>
    );
}
