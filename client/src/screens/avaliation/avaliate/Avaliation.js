import React from 'react';

import AvaliationCard from '../../../components/forms/AvaliationCard'
import "./AvaliationStyle.css"
import AvaliateApiService from '../../../services/AvaliateApiService';
import EventApiService from '../../../services/EventApiService';

export default class Avaliation extends React.Component {

    //apos as querys
    state = {
        idEvent: 0,
        title:'',
        dateEvent:'',
        local:'',
        qtdParticipants:0,
        qtdSamples:0,
        products: [],
        admUser: 0,
        avaliators:[],
        aspects: [
            { answer: "PALADAR" }
        ],
        SOM: false,
        VISAO: false,
        PALADAR: false,
        TATO: false,
        TEXTURA: false,
        SOMnote: 0,
        VISAOnote: 0,
        PALADARnote: 0,
        TATOnote: 0,
        TEXTURAnote: 0

    }
    constructor() {
        super();
        this.service = new EventApiService();

    }

      
      getLoggedUser=()=>{
        var value = localStorage.getItem('loggedUser');
        var user = value[6]+value[7];
        return user;
      }

    setnote=(note) =>{
        this.setState(note)
    }
    avaliate = async() => {

        console.log(this.state.title)
        
        // this.state.aspects.forEach(async aspect=>{
        //     console.log(aspect.answer)
        //     await this.service.create([{
        //         question: aspect.answer,
        //         evaluator: this.getLoggedUser(),
        //         note:{
        //             scale: aspect.answer=="SOM"? this.state.SOMnote: (aspect.answer=="VISAO"?this.state.VISAOnote:(aspect.answer=="PALADAR"? this.state.PALADARnote: aspect.answer=="TATO"?this.state.TATOnote: aspect.answer=="TEXTURA"?this.state.TEXTURAnote:""))
        //         }
        //     }]).catch(error => {
        //         console.log(error.response)
        //     });
        // })



    }

    componentDidMount() {
        const params = this.props.match.params;
        console.log(params);
        const eventId = params.id;
        console.log(eventId);
        this.findById(eventId);
      
        this.state.aspects.forEach(aspect => {
            console.log(aspect.answer)
            if (aspect.answer == "SOM") {
                this.setState({ SOM: true })
            }
            if (aspect.answer == "VISAO") {
                this.setState({ VISAO: true })
            }
            if (aspect.answer == "PALADAR") {
                this.setState({ PALADAR: true })
            }
            if (aspect.answer == "TATO") {
                this.setState({ TATO: true })
            }
            if (aspect.answer == "TEXTURA") {
                this.setState({ TEXTURA: true })
            }
        });
    }

    findById = async(eventId) =>{
        await this.service.find(`/filter?id=${eventId}`)
        .then(response=>{
            const event = response.data[0];
            console.log(response.data[0])
            const idEvent = event.id;
            const title = event.title;
            const dateEvent =  this.convertFromStringToDate(event.dateEvent);
            const local = event.local;
            const qtdParticipants= event.peopleLimit;
            const qtdSamples= event.numberSample;
            const admUser = event.admUser;
            this.setState({idEvent,title, dateEvent,local, qtdParticipants,qtdSamples,admUser});
        }).catch(error=>{
            console.log(error.response);
        })
    };

     convertFromStringToDate= (args) =>{
         var veri = args[1]
         if(veri<10){
             veri= "-0"+args[1];
         }
         else{
            veri= "-"+args[1];
         }
        const result = args[0]+veri+"-"+args[2];
       return result;
    };


    render() {
        return (
            <div>
                <div className='avaliation-container'>

                    <div className="card border-secondary mb-3">
                        <div className="card-body card-header-body">
                            {/* <h2>Produto: {this.state.product.name}</h2>
                            <h3>Amostra: {this.state.product.amostra}</h3> */}
                        </div>
                    </div>



                    <h4>Insira sua nota diante dos aspectos indicados com base na amostra consumida</h4>
                    <h5>Legenda: 0 = muito ruim, 10 = muito bom</h5>



                    <div className="avaliation-form">

                        <AvaliationCard active={this.state.SOM} aspect="SOM"></AvaliationCard>
                        <AvaliationCard active={this.state.VISAO} aspect="VISAO"></AvaliationCard>
                        <AvaliationCard active={this.state.PALADAR} aspect="PALADAR"></AvaliationCard>
                        <AvaliationCard active={this.state.TATO} aspect="TATO"></AvaliationCard>
                        <AvaliationCard active={this.state.TEXTURA} aspect="TEXTURA"></AvaliationCard>

                    </div>
                    <div className='avaliate-button'>
                        <button type="button" class="btn btn-primary" onClick={this.avaliate}>Avaliar</button>
                    </div>


                </div>
            </div>
        )
    }
}