export interface PATemplate {
  type: string;
  english: string;
  hindi: string;
}

export const PA_TEMPLATES: PATemplate[] = [
  {
    type: 'conflict',
    english: 'Attention devotees! Conflict zone detected at [Location]. Please use side gates and maintain calm to avoid congestion.',
    hindi: 'ध्यान दें भक्तगण! [Location] पर विरोधी प्रवाह क्षेत्र पता चला है। कृपया साइड गेट का उपयोग करें और शांत रहें।',
  },
  {
    type: 'muhurat',
    english: 'Muhurat approaching in [T] minutes. Expected surge at [Ghat]. Move calmly and follow instructions.',
    hindi: 'मुहूर्त [T] मिनट में आ रहा है। [Ghat] पर भीड़ बढ़ने की संभावना। शांतिपूर्वक आगे बढ़ें।',
  },
  {
    type: 'panic',
    english: 'Panic wave propagating towards [Direction]. Evacuate calmly via nearest safe path.',
    hindi: 'पैनिक वेव [Direction] की ओर बढ़ रही है। निकटतम सुरक्षित रास्ते से शांतिपूर्वक निकलें।',
  },
  {
    type: 'separation',
    english: 'High separation risk at [Ghat]. Families stay together; report to nearest kiosk.',
    hindi: '[Ghat] पर अलग होने का उच्च जोखिम। परिवार साथ रहें; निकटतम कियोस्क में रिपोर्ट करें।',
  },
  {
    type: 'capacity',
    english: 'Capacity breach predicted at [Ghat] in [T] min. Reroute to alternate path.',
    hindi: '[Ghat] पर [T] मिनट में क्षमता उल्लंघन की संभावना। वैकल्पिक रास्ते पर रीडायरेक्ट करें।',
  },
  {
    type: 'general',
    english: 'High density alert at [Location]. Maintain distance and follow police guidance.',
    hindi: '[Location] पर उच्च घनत्व अलर्ट। दूरी बनाए रखें और पुलिस निर्देशों का पालन करें।',
  },
];

export const generatePAScript = (
  type: string,
  replacements: Record<string, string>
): { english: string; hindi: string } => {
  const template = PA_TEMPLATES.find(t => t.type === type) || PA_TEMPLATES[5];
  let english = template.english;
  let hindi = template.hindi;
  
  Object.entries(replacements).forEach(([key, value]) => {
    english = english.replace(`[${key}]`, value);
    hindi = hindi.replace(`[${key}]`, value);
  });
  
  return { english, hindi };
};
