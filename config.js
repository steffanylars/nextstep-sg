/* NextStep SG — front-end config.
 * SAFE TO COMMIT: no secrets here. The ElevenLabs agent id is a public
 * client id (it only works with the domains you allow in the ElevenLabs
 * dashboard). Never put an API key in the frontend.
 *
 * TO ENABLE VOICE: paste your agent id between the quotes and reload.
 * (Create the agent in the ElevenLabs dashboard — see AGENT_PROMPT.md.)
 */
window.NEXTSTEP_CONFIG = {
  ELEVENLABS_AGENT_ID: "" // e.g. "agent_xxxxxxxxxxxxxxxxxxxxxxxx"
};
