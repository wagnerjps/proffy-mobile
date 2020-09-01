import React, { useState } from 'react'
import { View, Text, TextInput, ScrollView } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { BorderlessButton, RectButton } from 'react-native-gesture-handler'
import { Feather } from '@expo/vector-icons'
import AsyncStorage from '@react-native-community/async-storage'


import PageHeader from '../../components/PageHeader'
import TeacherItem, { Teacher } from '../../components/TeacherItem'
import api from '../../services/api'

import styles from './styles'

function TeacherList(){

    const [teachers, setTeachers] = useState([])
    const [favorites, setFavorites] = useState<Number[]>([])
    const [isfilterVisible, setIsfilterVisible] = useState(false)
    const [subject, setSubject] = useState('')
    const [week_day, setWeek_day] = useState('')
    const [time, setTime] = useState('')

    function loadFavorites() {
        AsyncStorage.getItem('favorites').then(reponse => {
            if(reponse){
                const favoritedTeachers = JSON.parse(reponse)
                const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => {
                    return teacher.id
                })
                setFavorites(favoritedTeachersIds)
            }
        })
    }

    useFocusEffect(() => {
        loadFavorites()
    })
    

    function handleToggleFilterVisible(){
        setIsfilterVisible(!isfilterVisible)
    }

    async function handleFilterSubmit(){
        loadFavorites()

        const response = await api.get('/classes', {
            params: {
                subject,
                week_day,
                time
            }
        })
        setIsfilterVisible(false)
        setTeachers(response.data)
    }
    
    return(
        <View style={styles.container}>
            <PageHeader 
                title='Proffys disponíveis'
                headerRight={(
                    <BorderlessButton onPress={handleToggleFilterVisible}>
                        <Feather name='filter' size={20} color='#FFF' />
                    </BorderlessButton>
                    )}
                >

                {isfilterVisible && (
                    <View style={styles.seachForm}>
                        <Text style={styles.label}>Matéria</Text>
                        <TextInput 
                            style={styles.input}
                            value={subject}
                            onChangeText={text => setSubject(text)}
                            placeholder='qual a matéria?'
                            placeholderTextColor='#c1bccc'
                            />
                        <View style={styles.inputGroup}>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Dia da Semana</Text>
                                <TextInput 
                                    style={styles.input}
                                    value={week_day}
                                    onChangeText={text => setWeek_day(text)}
                                    placeholder='Qual o dia?'
                                    placeholderTextColor='#c1bccc'
                                    />
                            </View>

                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Horário</Text>
                                <TextInput 
                                    style={styles.input}
                                    value={time}
                                    onChangeText={text => setTime(text)}
                                    placeholder='Qual o horário?'
                                    placeholderTextColor='#c1bccc'
                                    />
                            </View>

                        </View>

                        <RectButton 
                            onPress={handleFilterSubmit}
                            style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Filtrar</Text>
                        </RectButton>
                    </View>
                )}
            </PageHeader>

            <ScrollView 
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 10,
                    paddingBottom: 10,
                }}
                >
                    {teachers.map((teacher: Teacher) => {
                        return (
                            <TeacherItem 
                                key={teacher.id} 
                                teacher={teacher}
                                favorited={favorites.includes(teacher.id)} 
                                />
                            )
                    })}

            </ScrollView>
            
        </View>
    )
}

export default TeacherList