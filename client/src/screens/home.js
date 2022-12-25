import React from 'react';
import '../screens/home.css';
import Alysense from '../screens/Alysense.png';
import FormGroup from '../../src/components/forms/FormGroup';
import BigForm from '../../src/components/forms/BigForm';


import { withRouter } from 'react-router-dom';

import 'bootswatch/dist/journal/bootstrap.css';
class Home extends React.Component {

    state = {
    }
    /* componentDidMount(){
        this.enter();
    }

    enter = () => {
        // conexão

        alert("Usuário ADMIN")
        localStorage.setItem('typeUser', 'ADMIN');
        this.props.history.push('/newProduct')

    } */
    render() {
        return (
            <div className="register">

                <div>
                    <div className="input-container">
                        <img class="displayed" src={Alysense} className="circle responsive-img" alt=''/>
                    </div>

                </div>
                <div className='register-container'>
                    <div className='register-form'>
                        <BigForm title="Welcome">

                            <div className="input-container">
                                <FormGroup htmlFor="" label="">

                                </FormGroup>
                            </div>
                            <div className="input-container">
                            </div>
                        </BigForm>
                    </div>
                </div>

            </div>

        );

    }

}
export default withRouter(Home);