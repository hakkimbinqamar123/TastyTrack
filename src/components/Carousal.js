import React from 'react';

export default function Carousal() {
    return (
        <div>
            <div>
                <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner" id='carousel'>
                        <div className="carousel-item active">
                            <img src="https://source.unsplash.com/random/900x700/?burger" className="d-block w-100" alt="Burger" style={{ filter: "brightness(30%)" }} />
                            <div className="carousel-caption" style={{ position: 'absolute', top: '10%', left: '60%', transform: 'translateX(-50%)', width: '80%', textAlign: 'center' }}>
                                <form className="d-flex" role="search">
                                    <input className="form-control me-1" type="search" placeholder="Search" aria-label="Search" style={{ width: '70%' }} />
                                    <button className="btn btn-outline-success" type="submit">Search</button>
                                </form>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img src="https://source.unsplash.com/random/900x700/?pizza" className="d-block w-100" alt="Pizza" style={{ filter: "brightness(30%)" }} />
                            <div className="carousel-caption" style={{ position: 'absolute', top: '10%', left: '60%', transform: 'translateX(-50%)', width: '80%', textAlign: 'center' }}>
                                <form className="d-flex" role="search">
                                    <input className="form-control me-1" type="search" placeholder="Search" aria-label="Search" style={{ width: '70%' }} />
                                    <button className="btn btn-outline-success" type="submit">Search</button>
                                </form>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img src="https://source.unsplash.com/random/900x700/?barbeque" className="d-block w-100" alt="Barbeque" style={{ filter: "brightness(30%)" }} />
                            <div className="carousel-caption" style={{ position: 'absolute', top: '10%', left: '60%', transform: 'translateX(-50%)', width: '80%', textAlign: 'center' }}>
                                <form className="d-flex" role="search">
                                    <input className="form-control me-1" type="search" placeholder="Search" aria-label="Search" style={{ width: '70%' }} />
                                    <button className="btn btn-outline-success" type="submit">Search</button>
                                </form>
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
        </div>
    );
}
