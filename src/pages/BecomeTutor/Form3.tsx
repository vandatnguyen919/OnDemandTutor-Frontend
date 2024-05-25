import { Col, Button, Checkbox, Form } from 'antd';

import { useCallback, useState, memo } from 'react';
import { certificateForm, FieldType } from './Form.fields';

import * as FormStyled from './Form.styled';

import useDocumentTitle from '../../hooks/useDocumentTitle';
// interface Form3Props {
//   isTicked: boolean;
//   onTickChange: (checked: boolean) => void;
//   onFinish: (values: any) => void;
//   initialValues: any;
// }
const Form3 = ({isTicked, onTickChange, onFinish, initialValues, onClickBack }: any) => {
  useDocumentTitle('Become a tutor');

  //const file = useRef<UploadFile>();
  // const [visibility, setVisibility] = useState<boolean>(false)
  const [form, setForm] = useState<FieldType[][]>([certificateForm]);

  const addField = useCallback(() => {
    const newFieldKey = (form.length * certificateForm.length);
    const newForm: FieldType[] = certificateForm.map((field) => ({
      key: (field.key + newFieldKey),
      label: field.label,
      name: `${field.name}_${form.length}`,
      rules: field.rules,
      initialValue: field.initialValue,
      children: field.children,
      $width: field.$width,
    }));
    setForm((prevForm) => [...prevForm, newForm])
    console.log(form)
  }, [form.length]);

  const removeField = useCallback((formIndex: number) => {
    if (form.length > 1) {
      setForm((prevForm) => prevForm.filter((_, index) => index !== formIndex));
    } else {
      alert('At least one form must be present.');
    }
  },[form.length]);

  return (
    < Col lg={{ span: 12 }} sm={{ span: 16 }} xs={{ span: 24 }} style={{ margin: `auto` }}>
      <FormStyled.FormWrapper
        labelAlign='left'
        layout='vertical'
        requiredMark='optional'
        size='middle'
        onFinish={onFinish}
        initialValues={initialValues}
        >
        <FormStyled.FormContainer>
          <FormStyled.FormTitle level={1}>Certificate</FormStyled.FormTitle>
          <FormStyled.FormDescription>Do you have any relevant certificates? If so, describe them to enhance your profile credibility and get more students.</FormStyled.FormDescription>

          <Form.Item
        name='certificate'
        valuePropName="checked"
        style={{margin: `0`}}
          >
          <FormStyled.FormCheckbox 
            name='noCertificate' 
            style={{margin: `0`}}
            checked={isTicked}
            onChange={(e) => onTickChange(e.target.checked)}>
              I don’t have relevant certificates.</FormStyled.FormCheckbox>
        </Form.Item>
          {!isTicked && form.map((form, formIndex) => (
            <div>
              {formIndex > 0 && (
                <Button type='dashed' style={{ width: `100%`, margin: `24px 0px` }}  onClick={() => removeField(formIndex)}>
                  Remove
                </Button>
              )}
            <FormStyled.FormContainer key={formIndex}>
              
              {form.map((field) => (

                <FormStyled.FormItem
                  key={field.key}
                  label={field.label}
                  name={field.name}
                  rules={field.rules}
                  $width={field.$width ? field.$width : '100%'}
                  initialValue={field.initialValue}
                  validateFirst
                >

                  {field.children}
                </FormStyled.FormItem>
              ))}
              <Button type="dashed" onClick={addField}>
              Add another certificate
              </Button>
            </FormStyled.FormContainer>
            </div>
            
          ))}
          
        </FormStyled.FormContainer>
        
        <FormStyled.ButtonDiv>
          <Button type="default" onClick={() => onClickBack(1)}>Back</Button>
          <Button type="primary" htmlType="submit" style={{ marginLeft: `24px` }}>Save and continue</Button>
          </FormStyled.ButtonDiv>

      </FormStyled.FormWrapper>
    </Col>
  )
}

export default memo(Form3);


