Ext.define('Ecfa.store.queue.MissionState', {
	extend : 'Ext.data.Store',
	fields : [ 'display', 'value' ],
	data : [ {
		display : Ecfa.Converter.getMissionState(Ecfa.Const.Mission.State.RDY),
		value : Ecfa.Const.Mission.State.RDY
	},{
		display : Ecfa.Converter.getMissionState(Ecfa.Const.Mission.State.RUN),
		value : [ Ecfa.Const.Mission.State.RUN,Ecfa.Const.Mission.State.MOVGEN ] 
	},{
		display : Ecfa.Converter.getMissionState(Ecfa.Const.Mission.State.ERR),
		value : [ Ecfa.Const.Mission.State.ERR, Ecfa.Const.Mission.State.MOVGEN_ERR] 
	},{
		display : Ecfa.Converter.getMissionState(Ecfa.Const.Mission.State.PAUSE),
		value : [ Ecfa.Const.Mission.State.HOLDING,Ecfa.Const.Mission.State.PAUSE,Ecfa.Const.Mission.State.SYS_HOLDING, Ecfa.Const.Mission.State.SYS_PAUSE ] 
	}]
});
