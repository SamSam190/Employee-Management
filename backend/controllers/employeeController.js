const Employee = require('../models/Employee');
const axios = require('axios');

const addEmployee = async (req, res) => {
  try {
    const { name, email, department, skills, performanceScore, experience } = req.body;

    if (!name || !email || !department || !skills || performanceScore === undefined || !experience) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const employeeExists = await Employee.findOne({ email });
    if (employeeExists) {
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }

    const employee = await Employee.create({
      name,
      email,
      department,
      skills,
      performanceScore,
      experience
    });

    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({});
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchEmployees = async (req, res) => {
  try {
    const { department } = req.query;
    const query = {};
    if (department) {
      query.department = { $regex: new RegExp(department, 'i') };
    }
    const employees = await Employee.find(query);
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const aiRecommend = async (req, res) => {
  try {
    const employees = await Employee.find({});
    if (employees.length === 0) {
      return res.status(400).json({ message: 'No employees found to analyze.' });
    }

    const promptData = employees.map(emp => ({
      name: emp.name,
      department: emp.department,
      performanceScore: emp.performanceScore,
      skills: emp.skills,
      experience: emp.experience
    }));

    const prompt = `You are an AI HR assistant. Please analyze the following employee data and provide recommendations.
    Provide a JSON response with the following keys for each employee (use their name as the key):
    - promotionRecommendation (string: 'Highly Recommended', 'Recommended', 'Not Recommended')
    - feedback (string: customized feedback based on performance and experience)
    - trainingSuggestions (array of strings: based on missing skills or low performance)
    Also provide a 'rankings' array with employee names ordered by performance and overall value.
    
    Data: ${JSON.stringify(promptData)}
    
    Ensure the response is ONLY valid JSON without any markdown formatting like \`\`\`json.`;

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterApiKey || openRouterApiKey === 'your_openrouter_api_key_here') {
      // Mock response for development if API key is missing
       const mockResponse = {
         rankings: employees.sort((a,b) => b.performanceScore - a.performanceScore).map(e => e.name),
       };
       employees.forEach(emp => {
          mockResponse[emp.name] = {
            promotionRecommendation: emp.performanceScore >= 85 ? 'Highly Recommended' : (emp.performanceScore >= 70 ? 'Recommended' : 'Not Recommended'),
            feedback: emp.performanceScore >= 85 ? 'Excellent performance, keep it up!' : 'Needs improvement in core areas.',
            trainingSuggestions: ['Advanced Communication', 'Leadership']
          }
       });
       return res.json(mockResponse);
    }

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: "openai/gpt-3.5-turbo", // Most reliable model on OpenRouter
      messages: [{ role: "user", content: prompt }]
    }, {
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const aiResponseText = response.data.choices[0].message.content.trim();
    let cleanedResponseText = aiResponseText;
    const jsonMatch = cleanedResponseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        cleanedResponseText = jsonMatch[0];
    }
    
    // Remove trailing commas from the JSON string to prevent parsing errors
    cleanedResponseText = cleanedResponseText.replace(/,\s*([\]}])/g, '$1');
    
    let parsedResponse;
    try {
        parsedResponse = JSON.parse(cleanedResponseText.trim());
    } catch(e) {
        // Fallback if AI didn't return perfect JSON
        parsedResponse = { error: "Failed to parse AI response", raw: cleanedResponseText };
    }

    res.json(parsedResponse);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { addEmployee, getEmployees, searchEmployees, deleteEmployee, updateEmployee, aiRecommend };
