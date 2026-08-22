const express = require('express');
const router = express.Router();

function cleanKey(key) {
  return (key || '').replace(/^[ '"\r\n]+|[ '"\r\n]+$/g, '').trim();
}

const systemPrompt = `You are College Mitra, an intelligent, friendly, and expert AI academic counselor designed for polytechnic diploma students (MSBTE curriculum) in Maharashtra.
You provide clear, accurate, and structured answers in clean Markdown formatting.
When asked programming questions, provide complete code with explanations.
When asked about MSBTE subjects, exams, or career advice (like DSE admission), provide practical and helpful guidance.
CRITICAL INSTRUCTION: DO NOT output any internal thinking process, reasoning steps, or chain of thought (e.g., do not output <think> blocks or "Here's a thinking process"). Only output the final response directly to the user.`;

function getAlgorithmOrCode(q) {
  const query = q.toLowerCase();

  if (query.includes('binary search')) {
    return `### 🔍 Binary Search Algorithm\nBinary search is an efficient algorithm for finding an element in a **sorted array**.\n\n\`\`\`python\ndef binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: low = mid + 1\n        else: high = mid - 1\n    return -1\n\`\`\`\n\n- **Time Complexity:** $O(\\log n)$`;
  }
  if (query.includes('bubble sort')) {
    return `### 🫧 Bubble Sort Algorithm\n\`\`\`python\ndef bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr\n\`\`\`\n- **Time Complexity:** $O(n^2)$`;
  }
  if (query.includes('stack') && (query.includes('program') || query.includes('code'))) {
    return `### 📚 Stack Data Structure (LIFO)\n\`\`\`python\nclass Stack:\n    def __init__(self): self.items = []\n    def push(self, item): self.items.append(item)\n    def pop(self): return self.items.pop() if not self.is_empty() else "Underflow"\n    def is_empty(self): return len(self.items) == 0\n\`\`\``;
  }
  if (query.includes('fibonacci')) {
    return `### 🔢 Fibonacci Series\n\`\`\`python\ndef fibonacci(n):\n    a, b = 0, 1\n    for _ in range(n):\n        print(a, end=" ")\n        a, b = b, a + b\n\`\`\``;
  }
  if (query.includes('factorial')) {
    return `### ❗ Factorial Calculation\n\`\`\`python\ndef factorial(n):\n    return 1 if n == 0 else n * factorial(n - 1)\n\`\`\``;
  }
  if (query.includes('palindrome')) {
    return `### 🔁 Palindrome Check\n\`\`\`python\ndef is_palindrome(s):\n    return s == s[::-1]\n\`\`\``;
  }
  if (query.includes('sql') && query.includes('join')) {
    return `### 🗄️ SQL Joins Explained\n\`\`\`sql\nSELECT Students.name, Departments.dept_name\nFROM Students\nINNER JOIN Departments ON Students.dept_id = Departments.dept_id;\n\`\`\``;
  }
  return null;
}

async function fetchWikipediaSummary(query) {
  try {
    const cleanSearch = query
      .replace(/^(what is|who is|explain|tell me about|define|describe|how does|what are|who was)\s+/i, '')
      .replace(/[?.,!]/g, '')
      .trim();

    if (!cleanSearch || cleanSearch.length < 2) return null;

    const sRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleanSearch)}&format=json&origin=*`, {
      headers: { 'User-Agent': 'CollegeSahayak/1.0' }
    });

    if (!sRes.ok) return null;
    const sData = await sRes.json();

    if (sData.query?.search?.length > 0) {
      const topTitle = sData.query.search[0].title;
      const sumRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topTitle)}`, {
        headers: { 'User-Agent': 'CollegeSahayak/1.0' }
      });

      if (sumRes.ok) {
        const sumData = await sumRes.json();
        if (sumData.extract && sumData.extract.length > 25) {
          return `### 📖 **${sumData.title}**\n\n${sumData.extract}\n\n*Source: Academic Encyclopedia Knowledge Base*`;
        }
      }
    }
  } catch (err) {}
  return null;
}

function getAcademicResponse(q) {
  const query = (q || '').toLowerCase().trim();

  if (/^(hey|hi|hello|namaste|hola|good\s*(morning|afternoon|evening)|yo|sup)\b/i.test(query)) {
    return `### 👋 Hello! I'm **College Mitra**\nI am your AI academic and career counselor for **MSBTE Polytechnic Diploma** studies.\n\nHere is what you can ask me:\n- 📚 **Subjects & Concepts** (OSY, ACN, DAN, CLO, SEN)\n- 💻 **Programming & Code** (Python, C++, SQL)\n- ⚡ **Algorithms** (CPU Scheduling, Paging, Sorting)\n- 📝 **MSBTE Exam Prep** (70-mark patterns)\n- 🎓 **DSE Admissions** (CAP rounds, eligibility)`;
  }
  if (/(who (made|created|developed|built|are)|about|founder|developer|yash).*(you|college sahayak|platform|website|yash|founder|creator)/i.test(query) || /(who created|who made|founder of|developer of|yash date)/i.test(query)) {
    return `### 🎓 About College Sahayak & College Mitra\n**College Sahayak** is Maharashtra's dedicated digital platform designed to provide MSBTE diploma students with free, verified academic resources.\n\n- 👨‍💻 **Founder & Solo Developer:** **Yash Vijay Date**\n- 🎯 **Mission:** Centralize all diploma resources with zero clutter and lightning-fast access.\n- 🤖 **College Mitra:** The built-in AI counseling assistant.`;
  }
  if (/\b(operating system|osy|315319|process management|cpu scheduling|paging|deadlock|semaphore|threads?)\b/i.test(query)) {
    if (/\b(cpu scheduling|fcfs|sjf|round robin|priority scheduling)\b/i.test(query)) {
      return `### ⚡ CPU Scheduling in Operating System (OSY - 315319)\nCPU scheduling decides which process gets CPU time when the CPU becomes idle.\n\n#### 🔹 Algorithms:\n1. **FCFS:** Non-preemptive. Simple FIFO.\n2. **SJF:** Shortest burst time first.\n3. **Round Robin (RR):** Fixed Time Quantum (TQ).\n4. **Priority Scheduling:** Solves starvation using *Aging*.`;
    }
    if (/deadlock/i.test(query)) {
      return `### 🔒 Deadlock in Operating System (OSY)\n**4 Necessary Coffman Conditions:**\n1. **Mutual Exclusion**\n2. **Hold and Wait**\n3. **No Preemption**\n4. **Circular Wait**\n\n**Handling:** Banker's Algorithm (Avoidance), RAG (Detection).`;
    }
    return `### 🖥️ Operating System (OSY - 315319)\n**5 Core Units:**\n1. OS Services & Components\n2. Process Management\n3. CPU Scheduling\n4. Memory Management (Paging, Virtual Memory)\n5. File Management & Disk Scheduling`;
  }
  if (/\b(acn|315321|computer networks?|tcp|udp|ipv4|ipv6|subnetting|osi model|router|switch)\b/i.test(query)) {
    return `### 🌐 Advanced Computer Networks (ACN - 315321)\n- **OSI 7-Layer Model:** Physical ➔ Data Link ➔ Network ➔ Transport ➔ Session ➔ Presentation ➔ Application.\n- **TCP vs UDP:** TCP is reliable (3-way handshake); UDP is fast and connectionless.\n- **IPv4 vs IPv6:** 32-bit vs 128-bit addresses.`;
  }
  if (/(exam|preparation|tips|passing marks|study plan|how to study|important questions|imp|score good marks)/i.test(query)) {
    return `### 🎯 MSBTE Board Exam Preparation (70 Marks)\n- **Q1 (10 Marks):** Short definitions (Attempt 5/7).\n- **Q2-Q5:** Diagrams, differences, numericals (4 marks each).\n- **Q6 (12 Marks):** Case studies (6 marks each).\n\n**Tips:** Draw neat pencil diagrams, use bullet points, solve past 3 years PYQs.`;
  }
  if (/(dse|direct second year|engineering admission|cap round|cutoff|b\.?tech|b\.?e\.?)/i.test(query)) {
    return `### 🎓 Direct Second Year Engineering (DSE) Admission Guide\nAdmission is based on your **5th & 6th Semester Diploma Aggregate**.\nSteps:\n1. Document Verification at FC.\n2. CAP Rounds 1, 2, 3.\n3. TFWS (Tuition Fee Waiver Scheme) for eligible students.`;
  }
  return null;
}

router.post('/', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  const sendChunk = (text) => {
    if (text) {
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    }
  };

  const latestUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content || '';
  const rawMsg = latestUserMessage.trim();
  const groqKey = cleanKey(process.env.GROQ_API_KEY);
  const geminiKey = cleanKey(process.env.GEMINI_API_KEY);

  try {

    if (groqKey) {
      const groqMessages = [{ role: 'system', content: systemPrompt }, ...messages];
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-20b',
          messages: groqMessages,
          stream: true
        }),
      });

      if (response.ok) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || "";
          
          for (const line of lines) {
            if (line.startsWith('data: ') && line.trim() !== 'data: [DONE]') {
              try {
                const parsed = JSON.parse(line.slice(6));
                const text = parsed.choices[0]?.delta?.content || '';
                sendChunk(text);
              } catch (e) {}
            }
          }
        }
        res.end();
        return;
      }
    }

    if (geminiKey) {
      const contents = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      if (contents.length > 0 && contents[0].role === 'user') {
        contents[0].parts[0].text = systemPrompt + '\\n\\n' + contents[0].parts[0].text;
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      });

      if (response.ok) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || "";
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const parsed = JSON.parse(line.slice(6));
                const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
                sendChunk(text);
              } catch (e) {}
            }
          }
        }
        res.end();
        return;
      }
    }

    let finalReply = '';

    const mathMatch = rawMsg.match(/^(\\d+(\\.\\d+)?\\s*[\\+\\-\\*\\/\\%]\\s*\\d+(\\.\\d+)?(\\s*[\\+\\-\\*\\/\\%]\\s*\\d+(\\.\\d+)?)*)$/);
    if (mathMatch && !finalReply) {
      try {
        const expr = mathMatch[1].replace(/\\s+/g, '');
        const result = Function('"use strict";return (' + expr + ')')();
        finalReply = `The calculated result of **${expr}** is **${result}**.`;
      } catch (e) {}
    }

    if (!finalReply) finalReply = getAlgorithmOrCode(rawMsg);

    if (!finalReply) finalReply = getAcademicResponse(rawMsg);

    if (!finalReply) finalReply = await fetchWikipediaSummary(rawMsg);

    if (!finalReply) {
      finalReply = `### 💡 College Mitra Guidance\nI understand you are asking about: **"${rawMsg.substring(0, 80)}"**\n\nHere are some helpful options:\n- 📖 **Check Study Materials:** Explore our [Curriculum](/curriculum), [Lab Manuals](/manuals), and [PYQs](/pyqs).\n- 🔍 **Ask Details:** Feel free to provide more details about your specific question!`;
    }

    // Simulate real-time streaming for the fallback response
    const words = finalReply.split(/(\\s+)/);
    for (const word of words) {
      sendChunk(word);
      await new Promise(r => setTimeout(r, 10)); // 10ms delay per word
    }

  } catch (err) {
    console.error('Chat stream error:', err);
    sendChunk("\\n\\n*Sorry, I am having trouble connecting to my servers. Please try again.*");
  } finally {
    res.end();
  }
});

module.exports = router;
