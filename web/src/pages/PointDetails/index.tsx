import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Map, TileLayer,Marker } from 'react-leaflet'

import api from '../../services/api'
import './styles.css'

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
        <div className="page-detail">
            <img src={detail.point.image_url} alt="detail"/>
            <Map center={[detail.point.latitude, detail.point.longitude]} zoom={15}>
                    <TileLayer 
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                <Marker position={[detail.point.latitude, detail.point.longitude]} />
            </Map>
        </div>
    )
}

export default PointDetails