import React, { useEffect, useState } from 'react';
import { Select, Row, Col, message, Segmented, Divider, Modal } from 'antd';
import * as Styled from './Appointment.styled';
import Container from '../../../components/Container/Container';
import AppointmentList from '../../../components/AppointmentList/AppointmentList'
import { useAuth, useDocumentTitle } from '../../../hooks';
import type {Appointment, TimeSlot} from '../../../components/AppointmentList/Appointment.type';
import Pagination from '../../../components/Pagination/Pagination';
import AppointmentPagination from './AppointmentPagination/AppointmentPagination';
// import CreateQuestion from '../../../components/Popup/CreateQuestion/CreateQuestion';
const { Option } = Select;
// import { cancelAppointment } from '../../../utils/appointmentAPI'; // Assuming you have a cancelAppointment function in appointmentAPI
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { AppointmentStatus } from '../../../utils/enums';

const StudentAppointment = () => {
  useDocumentTitle("Appointment | MyTutor")

  
  const [initLoading, setInitLoading] = useState(true);
  const [list, setList] = useState<TimeSlot[]>([]);
  const [data, setData] = useState<TimeSlot[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [appointmentsPerPage] = useState(5);
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, contextHolderModal] = Modal.useModal();
  const [currentTab, setCurrentTab] = useState<string>('Upcoming');
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'Upcoming' | 'Past'>('Upcoming'); // State to manage view mode
  const [modalVisible, setModalVisible] = useState(false);
  const [cancelAppointmentId, setCancelAppointmentId] = useState<number>(null);
  
    let isDone = false;
    if(viewMode==='Past'){
      isDone = true; 
    }
    
  useEffect(() => {
    if (!user) return;
    setInitLoading(true); 
    const baseUrl: string = `http://localhost:8080/api/schedules/accounts/${user?.id}?isDone=${isDone}&isLearner=true&pageNo=${currentPage-1}&pageSize=${appointmentsPerPage}`;

    fetch(baseUrl)
      .then((res) => res.json())
      .then((res) => {
        setInitLoading(false);
        setData(res.content);
        setList(res.content);
        setTotalPages(res.totalPages);
        console.log("Fetched Data:", res.content);  // Add this line to debug the fetched data
      })
      .catch((err) => console.error('Failed to fetch student appointment:', err));
    window.scrollTo(0, 0);
    console.log(baseUrl);

  }, [appointmentsPerPage, currentPage, user, viewMode]);

  const handleTabChange = (value: string) => {
    setViewMode(value as 'Upcoming' | 'Past');
  };
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const filteredAppointments = () => {
    if (viewMode === 'Upcoming') {
        return list.filter(timeSlot => timeSlot.appointment.appointmentStatus === AppointmentStatus.PAID);
    } else if (viewMode === 'Past') {
        return list.filter(timeSlot => [AppointmentStatus.DONE, AppointmentStatus.CANCELED].includes(timeSlot.appointment.appointmentStatus));
    } else {
        return [];
    }
};
const checkCancel = (timeslotId: number) => {
  let checkCancel = false;
  const appointment = list.find(item => item.timeslotId === timeslotId);
  if (!appointment) return;

  const currentDate = new Date();
  const appointmentDate = new Date(appointment.scheduleDate + 'T' + appointment.startTime);

  // Calculate the difference in days
  const diffInDays = Math.floor((appointmentDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays <= 1) {
    // Show modal for confirmation
    checkCancel=true;
    setCancelAppointmentId(timeslotId);
    confirmCancel(timeslotId)
    return checkCancel;
  } 
};
const confirmCancel = (timeslotId: number) => {
  modal.confirm({
    centered: true,
    title: 'Do you want to cancel this lesson?',
    content: 'Since this time slot is within 3 days prior to the appointment, you cannot reschedule this. Do you want to proceed?',
    icon: <ExclamationCircleOutlined />,
    okText: 'Confirm',
    // onOk: () => handleCancelAppointment(timeslotId),
    cancelText: 'Back',
});
};
// const handleCancelAppointment = (appointmentId: number) => {
//   // Perform cancellation logic
//   cancelAppointment(appointmentId)
//     .then(() => {
//       messageApi.success('Lesson canceled successfully');
//       // Refetch appointments after cancellation
//       setCurrentPage(1); // Reset to first page
//     })
//     .catch(error => {
//       messageApi.error('Failed to cancel lesson');
//       console.error('Failed to cancel lesson:', error);
//     });
// };
// const handleModalOk = () => {
//   if (cancelAppointmentId) {
//     handleCancelAppointment(cancelAppointmentId);
//     setModalVisible(false);
//     setCancelAppointmentId(null);
//   }
// };

  
  


  return (
    <div style={{backgroundColor:'#fff'}}>
    {contextHolder}
      {/* <Styled.FilterSection>
        <Container>
          <Styled.SearchWrapper>
          
            <Row justify='space-between' align='middle' gutter={[20, 20]} style={{ width: '100%' }} >
            
              
            </Row>
          </Styled.SearchWrapper>
        </Container>
      </Styled.FilterSection> */}
      
      <Styled.TitleWrapper>
        <Container>
        <Styled.RowWrapper>
          <Segmented<string>
                    options={['Upcoming', 'Past']}
                    onChange={handleTabChange}
                    value={viewMode}
                />
          </Styled.RowWrapper>
          <Divider/>
          <Styled.TotalTutorAvaiable level={1}>
          {viewMode} Lessons
          </Styled.TotalTutorAvaiable>
          
        </Container>
      </Styled.TitleWrapper>

      <AppointmentList initLoading={initLoading} list={filteredAppointments()} onCancel={checkCancel(cancelAppointmentId)} />

      {totalPages > 1 &&
        <AppointmentPagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
      }
    </div>


  );
};

export default StudentAppointment;
