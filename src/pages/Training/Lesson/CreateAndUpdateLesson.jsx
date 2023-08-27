import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { useParams } from 'react-router-dom'
import Lesson from '../../../firebase/Lesson'
import CreateOrUpdateMCQ from './MCQ/CreateOrUpdateMCQ'
import CreateOrUpdateDnD from './DnD/CreateOrUpdateDnD'
import TabNavigator from '../../../components/TabNavigator'

function CreateAndUpdateLesson(props) {
    const lesson = new Lesson()
    const { lessonId } = useParams()
    const _lessonId = lessonId ?? props.lessonId
    const _updateMode = _lessonId ? true : false
    // This component could be used from both React router or Independent Component
    const [id, setId] = useState(_lessonId)
    // Update mode turns on automatically by passing lesson id
    const [updateMode, setUpdateMode] = useState(_updateMode)
    const [currentLesson, setCurrentLesson] = useState(null)
    const [lessonType, setLessonType] = useState('mcq')
    const [currentLessonLoading, setCurrentLessonLoading] = useState(false)

    useEffect(() => {
        if (updateMode && id) {
            setCurrentLessonLoading(true)
            lesson.getById(id).then(res => {
                setCurrentLesson(res.response)
                setCurrentLessonLoading(false)
            })
        }
    }, [updateMode])

    useEffect(() => {
      if (currentLesson) {
        setLessonType(currentLesson.data.type)
      }
    }, [currentLesson])

    const createOrUpdateLessonMap = {
      mcq: ({ ...props }) => <CreateOrUpdateMCQ { ...props } />,
      dnd: ({ ...props }) => <CreateOrUpdateDnD { ...props } />
    }

    const tabs = [
      {
        value: "mcq",
        label: "MCQ (Multiple Choice Question)",
        body: <CreateOrUpdateMCQ currentLesson={currentLesson} updateMode={updateMode} />
      },
      {
        value: "dnd",
        label: "DND (Drag & Drop Blanks)",
        body: <CreateOrUpdateDnD currentLesson={currentLesson} updateMode={updateMode} />
      }
    ]
  return <Box>
    <TabNavigator 
      tabs={tabs} 
      currentTab={lessonType}
      setCurrentTab={setLessonType}
    />
  </Box>
}

export default CreateAndUpdateLesson