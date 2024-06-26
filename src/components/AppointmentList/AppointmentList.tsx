import React from 'react';
import { Col, List, Row } from 'antd';
import * as Styled from './Appointment.styled';
import Container from '../Container';
import { Appointment, TimeSlot } from './Appointment.type';
import AppointmentItem from './AppointmentItem/AppointmentItem';
import { useAuth } from '../../hooks';

interface AppointmentListProps {
  list: TimeSlot[];
  initLoading: boolean;
  user?: UserType;
  onCancel: (timeslotId: number) => void; // Pass the onCancel function prop
}

const AppointmentList: React.FC<AppointmentListProps> = ({ initLoading, list, user, onCancel }) => {
  // const {user} = useAuth();

  return (
    <>
      <Styled.TutorFilteredSection>
        <Container>
          <Styled.TutorFiltered>
            <Row justify='space-between'>
              <Col lg={24} md={24} xs={24} sm={24}>
                <List
                  loading={initLoading}
                  itemLayout="horizontal"
                  dataSource={list}
                  renderItem={(item) => (
                    <Styled.TutorItem>
                      <AppointmentItem item={item} user={user} onCancel={onCancel}/>
                    </Styled.TutorItem>
                  )}
                    />
              </Col>
            </Row>

          </Styled.TutorFiltered>
        </Container>
      </Styled.TutorFilteredSection>
    </>

  );
}

export default AppointmentList;