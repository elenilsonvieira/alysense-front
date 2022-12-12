import React from 'react';

import AvaliationCard from '../../../components/cards/AvaliationCard'
import "./AvaliationStyle.css"
import AvaliateApiService from '../../../services/AvaliateApiService'
import ProductApiService from '../../../services/ProductApiService';
import axios from 'axios';
import Select from 'react-select';

export default class Avaliation extends React.Component {

    //apos as querys
    state = {
        id: '',
        question: '',
        event: {
            title: ''
        },
        evaluetItems: [
            { evaluatorUser: '' },
            { samples: [] },
            { answer: "SOM" },
            { note: '' }
        ],
        product: {
            name: '',
        },

        SOM: false,
        VISAO: false,
        PALADAR: false,
        TATO: false,
        TEXTURA: false,
        SOMnote: 0,
        VISAOnote: 0,
        PALADARnote: 0,
        TATOnote: 0,
        TEXTURAnote: 0,
        selectOptions: [],
        selectProducts: []
    }
    constructor(props) {
        super(props);
        this.services = new AvaliateApiService();
        this.services = new ProductApiService();
        this.state = {
            id: '',
            question: '',
            event: {
                title: ''
            },
            evaluetItems: [
                { evaluatorUser: '' },
                { samples: [] },
                { answer: "SOM" },
                { note: '' }
            ],
            product: {
                name: '',
            },
            title: '',
            selectOptions: [],
            selectProducts: []
        }

    }

    find = async () => {
        var params = '?';

        if (this.state.id !== '') {
            if (params !== '?') {
                params = `${params}&`;
            }
            params = `${params}id=${this.state.id}`;
        }
        await this.service.post(`/filter/${params}`)
            .then(response => {
                const avaliation = response.data;
                this.setState({ avaliation })
                console.log(this.state.avaliation)
            }).catch(error => {
                console.log(error.response);
            })
    }

    async getEvents() {
        const res = await axios.get('http://localhost:8081/api/event/all')
        const data = res.data

        const options = data.map(d => ({
            "value": d.id,
            "label": d.title
        }))
        this.setState({ selectOptions: options })

    }

    async getProducts(id) {
        const res = await axios.get(`http://localhost:8081/api/event/filter?id=${id}`)
        const data = res.data
        console.log(data[0].items);
        const options = data.map(d => ({
            "value": d.items.id,
            "label": d.items.name
    }))
        this.setState({ selectProducts: options })
        this.setState(this.state.selectProducts=data[0].items)
        this.state.selectProducts = data[0].items;
    }

    getLoggedUser = () => {
        var value = localStorage.getItem('loggedUser');
        var user = value[6] + value[7];
        return user;
    }

    setnote = (note) => {
        this.setState(note)
    }
    avaliate = async () => {

        this.state.evaluetItems.forEach(async evaluetItems => {
            console.log(evaluetItems.answer)

            await this.service.create([{
                question: "",
                event: this.avaliate.title,
                evaluatorUser: this.getLoggedUser(),
                samples: evaluetItems.value,
                note: {
                    question: evaluetItems.answer === "SOM" ? this.state.SOMnote : (evaluetItems.answer === "VISAO" ? this.state.VISAOnote : (evaluetItems.answer === "PALADAR" ? this.state.PALADARnote : evaluetItems.answer === "TATO" ? this.state.TATOnote : evaluetItems.answer === "TEXTURA" ? this.state.TEXTURAnote : ""))
                }
            }]).catch(error => {
                console.log(error.response)
            });
        })

    }

    componentDidMount() {
        this.getEvents();
        this.state.evaluetItems.forEach(evaluetItems => {
            console.log(evaluetItems.answer)
            if (evaluetItems.answer === "SOM") {
                this.setState({ SOM: true })
            }
            if (evaluetItems.answer === "VISAO") {
                this.setState({ VISAO: true })
            }
            if (evaluetItems.answer === "PALADAR") {
                this.setState({ PALADAR: true })
            }
            if (evaluetItems.answer === "TATO") {
                this.setState({ TATO: true })
            }
            if (evaluetItems.answer === "TEXTURA") {
                this.setState({ TEXTURA: true })
            }
        });
    }
    handleChange(e) {
        
       this.getProducts(e.value);
        
    }

    handleProduct(e) {
        
    }

    contemSelect() {
        if (this.state.title !== "") {
            this.getProducts(this.state.id);
        }
        return "";
    }
    render() {
        console.log(this.state.selectOptions)
        return (
            <div>
                <div className='avaliation-container'>

                    <div className="card border-secondary mb-3">
                        <div className="card-body card-header-body">
                            <br />
                            <br />

                            <div>
                                <h5> Evento: </h5>
                                <Select options={this.state.selectOptions} onChange={this.handleChange.bind(this)} />
                            </div>
                            <br />
                            <div>
                                <h5>Produto: </h5>
                                <Select options={this.state.selectProducts} onChange={this.handleChange.bind(this)} />
                                
                            </div>
                            <br />

                            <div>
                                <h5>Amostra: </h5>
                                <Select options={this.state.selectProducts} onChange={this.handleProduct.bind(this)} />
                            </div>
                        </div>
                    </div>

                    <h4>Insira sua nota diante dos aspectos indicados com base na amostra consumida</h4>
                    <h5>Legenda:
                        <br />
                        0 = Muito ruim
                        <br />
                        10 = Muito bom</h5>

                    <div className="avaliation-form">

                        <AvaliationCard active={this.state.SOM} aspect="SOM"></AvaliationCard>
                        <AvaliationCard active={this.state.VISAO} aspect="VISAO"></AvaliationCard>
                        <AvaliationCard active={this.state.PALADAR} aspect="PALADAR"></AvaliationCard>
                        <AvaliationCard active={this.state.TATO} aspect="TATO"></AvaliationCard>
                        <AvaliationCard active={this.state.TEXTURA} aspect="TEXTURA"></AvaliationCard>

                    </div>
                    <div className='avaliate-button'>
                        <button type="button" className="btn btn-primary" onClick={this.avaliate}>Avaliar</button>
                    </div>

                </div>
            </div>
        )
    }
}