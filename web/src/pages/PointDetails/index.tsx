import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Map, TileLayer,Marker } from 'react-leaflet'
import { FiMail, FiArrowLeft } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'

import api from '../../services/api'
import './styles.css'

import logo from '../../assets/logo.svg'

interface Detail {
    point: {
        name: string
        email: string
        whatsapp: string
        city: string
        uf: string
        image: string
        image_url: string
        longitude: number
        latitude: number
    },
    items: {
        title: string
    }[]
}

const PointDetails = () => {

    const [ detail, setDetail ] = useState<Detail>({} as Detail)

    const { id } = useParams()

    useEffect(() => {
        api.get(`points/${id}`).then(response => {
            setDetail(response.data)
        })
    }, [])

    if(!detail.point) {
        return null
    }

    return (
        <div id="page-point-detail">

            <header>
                <img src={logo} alt="Ecoleta"/>

                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>

            <div className="page-detail">

                <div className="details-map-image">
                    <img src={detail.point.image_url} alt="detail"/>
                    <Map className="map" center={[detail.point.latitude, detail.point.longitude]} zoom={15}>
                        <TileLayer 
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    
                        <Marker position={[detail.point.latitude, detail.point.longitude]} />
                    </Map>
                </div>
                <div className="page-detail-description">
                    <h1>{detail.point.name}</h1>
                    <p>{detail.point.city} - {detail.point.uf}</p>
                    <p><span className="email"><FiMail /></span><span>E-mail: {detail.point.email}</span></p>
                    <p><span className="whatsapp"><FaWhatsapp /></span><span>Whatsapp: {detail.point.whatsapp}</span></p>
                    <h2>Itens Coletados no local:</h2>
                    <p>
                        {detail.items.map(item => item.title).join(', ')}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default PointDetails