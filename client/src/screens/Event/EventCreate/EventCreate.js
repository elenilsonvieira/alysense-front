import React from 'react';
import BigForm from '../../../components/forms/BigForm';
import './EventCreateStyle.css';
import FormGroup from '../../../components/forms/FormGroup';
import CardProduct from '../../../components/tables/Product/CardProduct';
import EventApiService from '../../../services/EventApiService';
import ProductEvent from '../../../components/tables/Product/ProductEvent';
import { showSucessMessage, showErrorMessage, showWarningMessage } from '../../../components/Toastr/Toastr'
import Modal from 'react-modal';
import AvaliationApiService from '../../../services/AvaliationApiService';
import FormGroupCheck from '../../../components/forms/FormGroupCheck';
import axios from 'axios';

import ProductApiService from '../../../services/ProductApiService';

export default class EventCreate extends React.Component {


    componentDidMount() {
        this.findProducts();
    }

    state = {
        title: '',
        local: '',
        dateEvent: '',
        qtdParticipants: 1,
        qtdSamples: 1,
        products: [],
        admUser: '',
        avaliators: [],
        minimunAge: 1,
        typeScales: '',


        id: '',
        name: '',
        avaliation: [],
        toggleAvaliation: false

    }

    constructor() {
        super();
        this.serviceEvent = new EventApiService();
        this.serviceProduct = new ProductApiService();
        this.serviceAvaliation = new AvaliationApiService();
    }


    find = async () => {
        var params = '?';

        if (this.state.id != '') {
            if (params != '?') {
                params = `${params}&`;
            }
            params = `${params}id=${this.state.id}`;
        }

        await this.serviceProduct.find(`/filter/${params}`)
            .then(response => {
                const products = response.data;
                this.setState({ products })
                console.log(this.state.products)
            }).catch(error => {
                console.log(error.response);
            })

    }

    validate = () => {
        const errors = [];

        if (!this.state.title) {
            errors.push('Campo titulo ?? obrigat??rio!')
        }
        if (!this.state.local) {
            errors.push('informe o local do evento!')
        }
        if (!this.state.dateEvent) {
            errors.push('informe a data do evento!')
        }
        if (!this.state.qtdParticipants) {
            errors.push('Campo da quantidade de participantes ?? obrigat??rio!')
        }
        if (!this.state.qtdSamples) {
            errors.push('Campo quantidade de amostras ?? obrigat??rio!')
        }

        return errors;
    };

    getLoggedUser = () => {
        var value = localStorage.getItem('loggedUser');
        var user = value[6] + value[7];
        return user;
    }

    submit = async () => {
        this.checked()
        console.log(this.state.typeScales)

        this.state.admUser = this.getLoggedUser()
        const errors = this.validate();
        if (errors.length > 0) {
            errors.forEach((message, index) => {
                showErrorMessage(message)
            });
            return false;
        }

        await this.serviceEvent.create({
            title: this.state.title,
            dateEvent: this.state.dateEvent,
            local: this.state.local,
            peopleLimit: this.state.qtdParticipants,
            numberSample: this.state.qtdSamples,
            items: this.state.products,
            evaluators: this.state.avaliators,
            admUser: this.state.admUser,
            typeScale: this.state.typeScales


        },this.state.avaliation.forEach(element=>{
            this.serviceAvaliation.create(element).then(response => {
            console.log(response)
            showSucessMessage("Produto Criado!");
        }).catch(error => {
            console.log(error.response)
        });
        })).then(response => {
            console.log(response)
            showSucessMessage("Evento Criado!");
            this.props.history.push(`/EventFeed`);
        }).catch(error => {
            console.log(error.response)
        });
        /*this.state.avaliation.forEach(element =>{
            console.log(element.value)
            this.serviceAvaliation.create({
                answer: element.value
            })
        })*/
        this.state.avaliation.forEach(element=>{
            console.log(element)
            this.serviceAvaliation.create(element).then(response => {
            console.log(response)
            showSucessMessage("Evento Criado!");
        }).catch(error => {
            showWarningMessage("Erro ao criar evento!");
            console.log(error.response)
        });
        })
        console.log("request finished");

    }

    findProducts = () => {
        this.find();

    }
    remove = (product) => {
        axios.delete(`http://localhost:8081/api/product/${product.id}`)
            .then(response => {
                console.log(response);
                this.findProducts();
            }
            ).catch(error => {
                console.log(error.response);
            }
            )
    }
    addAvaliation = () => {
        const elements = document.getElementsByClassName("checkAspect");

        for (let index = 0; index < elements.length; index++) {
            const element = elements[index];
            if (element.checked) {
                let notIn = true;
                for (let i = 0; i < this.state.avaliation.length; i++) {
                    if (this.state.avaliation[i].answer == element.value) {
                        notIn = false;
                    }

                }
                if (notIn == true) {
                    this.state.avaliation.push({ answer: element.value })
                }

            }

        }
        console.log(this.state.avaliation)

    }
    addon = (product) => {
        this.setState({ toggleAvaliation: true })
        this.state.addedProducts.push(product)
    }

    openProductViews = () => {
        this.props.history.push('/newProduct');
    }

    checked = () => {
        if (document.getElementById("HEDONIC").checked) {
            this.state.typeScales = "HEDONIC";
        }
        if (document.getElementById("HEDONIC_FACIAL").checked) {
            this.state.typeScales = "HEDONIC_FACIAL";
        }
        if (document.getElementById("HEDONIC_NUMERAL").checked) {
            this.state.typeScales = "HEDONIC_NUMERAL";
        }
    }

    render() {
        return (
            <div className="event-create">
                <header className="EventCreate-header">
                    <div className="main-container">
                        <BigForm title="CRIAR NOVO EVENTO" submit={this.submit} action="Adicionar">
                            <div className='titulo'>
                                <FormGroup label="T??tulo">
                                    <input type='titulo' className='form-control' id='inputTitulo'
                                        placeholder='Digite o t??tulo do evento' value={this.state.title} onChange={(e) => this.setState({ title: e.target.value })}></input>
                                </FormGroup>
                            </div>

                            <div className='half-container'>
                                <div className='local'>
                                    <FormGroup label="Local">
                                        <input type='local' className='form-control' id='inputLocal'
                                            placeholder='Digite o local do evento' value={this.state.local} onChange={(e) => this.setState({ local: e.target.value })}></input>
                                    </FormGroup>
                                </div>
                                <div className='dateEvent'>
                                    <FormGroup label="Data do evento">
                                        <input type='date' className='form-control' id='inputDate'
                                            placeholder='Digite a data do evento' value={this.state.dateEvent} onChange={(e) => this.setState({ dateEvent: e.target.value })}></input>
                                    </FormGroup>
                                </div>
                            </div>

                            <div className='half-container conteiner-down'>
                                <div className='participants'>
                                    <FormGroup label="Qtd. de participantes">
                                        <input type="number" min="1" className='form-control' id='inputParticipants'
                                            placeholder='Qtd. de participantes' value={this.state.qtdParticipants} onChange={(e) => this.setState({ qtdParticipants: e.target.value })}></input>
                                    </FormGroup>
                                </div>
                                <div className='samples'>
                                    <FormGroup label="Qtd. de amostras">
                                        <input type="number" min="1" className='form-control' id='inputSamples'
                                            placeholder='Qtd. de amostras' value={this.state.qtdSamples} onChange={(e) => this.setState({ qtdSamples: e.target.value })}></input>
                                    </FormGroup>
                                </div>
                                <div className='minimun-age'>
                                    <FormGroup label="Idade M??nima">
                                        <input type="number" min="1" className='form-control' id='minimunAge'
                                            placeholder='Idade M??nima' value={this.state.minimunAge} onChange={(e) => this.setState({ minimunAge: e.target.value })}></input>
                                    </FormGroup>
                                </div>
                            </div>
                            <br />
                            <br />
                            <div class="card-header">Indique o tipo de escala que ser?? utilizado:    </div>

                            <div class="card-body radio-options ">
                                <FormGroupCheck htmlFor="0" label="Hed??nica">
                                    <input type="radio" value="HEDONIC" name="typeScale" id='HEDONIC' className='form-check-input' />
                                </FormGroupCheck>
                                <FormGroupCheck htmlFor="1" label="Hed??nica Facial">
                                    <input type="radio" value="HEDONIC_FACIAL" name="typeScale" id='HEDONIC_FACIAL' className='form-check-input' />
                                </FormGroupCheck>
                                <FormGroupCheck htmlFor="2" label="Hed??nica Num??rica">
                                    <input type="radio" value="HEDONIC_NUMERAL" name="typeScale" id='HEDONIC_NUMERAL' className='form-check-input' />
                                </FormGroupCheck>
                            </div>
                            <br />
                            <br />
                            <div className='CardTable'>
                                <CardProduct action='Adicionar' find={this.openProductViews} collection={this.state.products} remove={this.remove}
                                    label='Produtos' >
                                </CardProduct>
                            </div>


                        </BigForm>
                    </div>
                </header>

            </div>
        )
    }
}