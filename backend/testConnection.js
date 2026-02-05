import axios from 'axios';

const testConnection = async () => {
  try {
    console.log('Testing backend connection...');
    
    const response = await axios.post('http://localhost:5000/api/interview/question', {
      role: 'Java Developer',
      level: 'Fresher',
      jobDescription: 'Java backend development',
      questionNumber: 1,
      previousQA: []
    });
    
    console.log('✅ Backend connected successfully!');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Backend connection failed:');
    console.log('Error:', error.response?.data || error.message);
  }
};

testConnection();