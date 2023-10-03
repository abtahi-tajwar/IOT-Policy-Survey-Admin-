import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { useParams } from 'react-router-dom'
import Lesson from '../../../firebase/Lesson'
import CreateOrUpdateMCQ from './MCQ/CreateOrUpdateMCQ'
import CreateOrUpdateDnD from './DnD/CreateOrUpdateDnD'
import TabNavigator from '../../../components/TabNavigator'
import Loader from '../../../components/Loader'
import CreateOrUpdateDemographics from './Demographics/CreateOrUpdateDemographics'
import CreateOrUpdateAttentionCheck from './AttentionCheck/CreateOrUpdateAttentionCheck'

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
    const [lessonType, setLessonType] = useState(null)
    const [currentLessonLoading, setCurrentLessonLoading] = useState(false)

    useEffect(() => {
        if (updateMode && id) {
            setCurrentLessonLoading(true)
            lesson.getById(id, ['image']).then(res => {
                console.log("Downloaded lesson", res.response.data)
                setCurrentLesson(res.response.data)
                setCurrentLessonLoading(false)
            })
        }
    }, [updateMode])

    useEffect(() => {
      console.log("Current lesson final state", currentLesson)
      if (currentLesson) {
        setLessonType(currentLesson.type)
      }
    }, [currentLesson])

    const createOrUpdateLessonMap = {
      mcq: ({ ...props }) => <CreateOrUpdateMCQ { ...props } />,
      dnd: ({ ...props }) => <CreateOrUpdateDnD { ...props } />
    }

    const tabs = [
      {
        value: "mcq",
        label: "MCQ",
        body: <CreateOrUpdateMCQ lessonId={id} currentLesson={currentLesson} setCurrentLesson={setCurrentLesson} updateMode={updateMode} />
      },
      {
        value: "dnd",
        label: "DND (Drag & Drop Blanks)",
        body: <CreateOrUpdateDnD lessonId={id} currentLesson={currentLesson} setCurrentLesson={setCurrentLesson} updateMode={updateMode} />
      },
      {
        value: "demographics",
        label: "Demographics",
        body: <CreateOrUpdateDemographics lessonId={id} currentLesson={currentLesson} setCurrentLesson={setCurrentLesson} updateMode={updateMode} />
      },
      {
        value: "attention_check",
        label: "Attention Check",
        body: <CreateOrUpdateAttentionCheck lessonId={id} currentLesson={currentLesson} setCurrentLesson={setCurrentLesson} updateMode={updateMode} />
      }
    ]
  return <Box>
    <Loader isLoading={currentLessonLoading}>
      {
        !updateMode ? <TabNavigator 
          tabs={tabs} 
          currentTab={'mcq'}
          setCurrentTab={setLessonType}
        /> : <>
          {currentLesson && lessonType === 'mcq' && <CreateOrUpdateMCQ lessonId={id} currentLesson={currentLesson} setCurrentLesson={setCurrentLesson} updateMode={updateMode} /> }
          {currentLesson && lessonType === 'dnd' && <CreateOrUpdateDnD lessonId={id} currentLesson={currentLesson} setCurrentLesson={setCurrentLesson} updateMode={updateMode} /> }
          {currentLesson && lessonType === 'demographics' && <CreateOrUpdateDemographics lessonId={id} currentLesson={currentLesson} setCurrentLesson={setCurrentLesson} updateMode={updateMode} /> }
          {currentLesson && lessonType === 'attention_check' && <CreateOrUpdateAttentionCheck lessonId={id} currentLesson={currentLesson} setCurrentLesson={setCurrentLesson} updateMode={updateMode} /> }
        </>
      }
      {/* {(!updateMode || (currentLesson && lessonType)) && <TabNavigator 
        tabs={tabs} 
        currentTab={lessonType ?? 'mcq'}
        setCurrentTab={setLessonType}
      />} */}
    </Loader>
  </Box>
}

export default CreateAndUpdateLesson