import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft} from 'react-icons/fi'
//import { Map, TileLayer,Marker } from 'react-leaflet'
import axios from 'axios'
//import { LeafletMouseEvent } from 'leaflet'

import api from '../../services/api'

import './styles.css'

import logo from '../../assets/logo.svg'

interface Item {
    id: number
    title: string
    image_url: string
}

interface IBGEUFResponse {
    sigla: string
}

interface IBGECityResponse {
    nome: string
}

interface Points {
    id: number
    city: string
    uf: string
    email: string
    whatsapp: string
    name: string
    image: string
    items: {
        title: string
    }
}

const SearchPoint = () => {

    const [ searchComplete, setSearchComplete ] = useState(false)
    const [ pointsData, setPointsData ] = useState<Points[]>([])

    const [ items, setItems ] = useState<Item[]>([])
    const [ ufs, setUfs ] = useState<string[]>([])
    const [ cities, setCities ] = useState<string[]>([])

    const [ selectedUf, setSelectedUf ] = useState('0')
    const [ selectedCity, setSelectedCity ] = useState('0')

    const [ selectedItems, setSelectedItems ] = useState<number[]>([])

    const [ submitItems, setSubmitItems ] = useState<Item[]>([])

    const history = useHistory() 

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data)
        })
    }, [])

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla)

            setUfs(ufInitials)
        })
    }, [])

    useEffect(() => {
        if(selectedUf === '0'){
            return
        }
        
        axios
            .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
                const cityNames = response.data.map(city => city.nome)

                setCities(cityNames)
            })

    }, [selectedUf])

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value

        setSelectedUf(uf)
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value

        setSelectedCity(city)
    }

    function handleSelectItem(id: number) {

        const alreadySelected = selectedItems.findIndex(item => item === id)

        if(alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id)

            setSelectedItems(filteredItems)
        } else {
            setSelectedItems([ ...selectedItems, id ])
        }

        
    }

    async function handleSubmitItem() {
        const items = await api.get('items', {
            params: {
                items: selectedItems
            }
        })

        setSubmitItems(items.data)
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()
        if(selectedUf === '0' || selectedCity === '0') {
            return
        }

        const points = await api.get('points', {
            params: {
                city: selectedCity,
                uf: selectedUf,
                items: selectedItems
            }
        })

        setPointsData(points.data)
        handleSubmitItem()
        setSearchComplete(true)
    }

    return(
        <div id="page-search-point">

            <header>
                <img src={logo} alt="Ecoleta"/>

                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>

            {searchComplete ? 
            <ul className="SearchComplete">
                    {pointsData.map(point => (
                        <li key={point.id} className="listSearch">
                                <img src={point.image} />
                            <div>
                                <h2>{point.name}</h2>
                                <p>{point.city} - {point.uf}</p>
                                <p>E-mail: {point.email}</p>
                                <p>Whatsapp: {point.whatsapp}</p>
                                <div className="itens">
                                    <h3>ItensColetados:</h3>
                                    {submitItems.map(item => (
                                        selectedItems.map(select => {
                                            if(select == item.id) {
                                                return <p key={item.id}>{item.title}</p>
                                            }
                                        })
                                    ))}
                                </div>
                            </div>
                        </li>
                    ))} 
                    <button className="btn" onClick={() => history.push('/')}>
                        Voltar para Home
                    </button>
            </ul>
            
            : 

            <form onSubmit={handleSubmit}>
                <h1>Pesquisar ponto de coleta</h1>

                <fieldset>
                
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select 
                                name="uf" 
                                id="uf" 
                                value={selectedUf} 
                                onChange={handleSelectUf}
                            >
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select 
                                name="city" 
                                id="city"
                                value={selectedCity} 
                                onChange={handleSelectCity}
                            >
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                    </div>

                </fieldset>
                
                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais ítens abaixo</span>
                    </legend>

                    <ul className="items-grid">

                        {items.map(item => (
                            <li 
                                key={item.id} 
                                onClick={() => handleSelectItem(item.id)}
                                className={selectedItems.includes(item.id) ? 'selected' : ''}
                            >
                                <img src={item.image_url} alt={item.title}/>
                                <span>{item.title}</span>
                            </li>  
                        ))}

                    </ul>
                </fieldset>
                
                <button type="submit" className="btn">
                    Pesquisar ponto de coleta
                </button>

            </form>
            }

        </div>
    )
}

export default SearchPoint